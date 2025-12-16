import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, QrCode, Search, CheckCircle, XCircle, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface AdminScannerScreenProps {
    onNavigate: (screen: string) => void;
}

export function AdminScannerScreen({ onNavigate }: AdminScannerScreenProps) {
    const [inputVal, setInputVal] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);

    // Store the cleanup function or instance to handle StrictMode double-invokes
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        if (isScanning) {
            setCameraError(null);

            // Give DOM time to render the #reader div
            const timeout = setTimeout(() => {
                if (!scannerRef.current) {
                    try {
                        const html5QrCode = new Html5Qrcode("reader", {
                            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], // Only scan QR codes
                            verbose: false,
                        });
                        scannerRef.current = html5QrCode;

                        html5QrCode.start(
                            { facingMode: "environment" },
                            {
                                fps: 30, // Max speed
                                qrbox: { width: 200, height: 200 }, // Focused scan area
                                disableFlip: true, // Skip mirror processing
                            },
                            (decodedText) => {
                                // Success
                                console.log("Scan match:", decodedText);
                                setInputVal(decodedText);
                                setIsScanning(false); // Triggers cleanup
                                handleScan(decodedText);
                            },
                            () => {
                                // Ignore parse errors, they happen every frame
                            }
                        ).catch((err) => {
                            console.error("Camera Start Error:", err);
                            setCameraError(`Camera Error: ${err?.message || 'Permission denied or device not found'}`);
                            setIsScanning(false);
                        });

                    } catch (err: any) {
                        setCameraError("Failed to initialize scanner: " + err.message);
                        setIsScanning(false);
                    }
                }
            }, 100);

            return () => {
                clearTimeout(timeout);
                if (scannerRef.current) {
                    // Stop can fail if not started, so we catch
                    scannerRef.current.stop().then(() => {
                        scannerRef.current?.clear();
                        scannerRef.current = null;
                    }).catch(err => {
                        console.warn("Failed to stop scanner", err);
                        // Force clear if stop failed
                        scannerRef.current?.clear();
                        scannerRef.current = null;
                    });
                }
            };
        }
    }, [isScanning]);

    const handleScan = async (valOverride?: string) => {
        const valToUse = valOverride || inputVal;
        if (!valToUse) return;

        setLoading(true);
        setResult(null);
        setErrorMsg(null);

        try {
            // 1. Parse Input: It might be a JSON string (from QR) or just an ID
            let idToSearch = valToUse.trim();
            // let type = 'unknown'; // Unused variable removed

            if (valToUse.startsWith('{')) {
                try {
                    const parsed = JSON.parse(valToUse);
                    idToSearch = parsed.id;
                    // type = parsed.type;
                } catch (e) {
                    console.error("Not a JSON string, treating as ID");
                }
            }

            // 2. Query DB
            // We check 'memberships' table first. If not found, could check 'tickets' (future)
            const { data, error } = await supabase
                .from('memberships')
                .select('*')
                .eq('id', idToSearch)
                .single();

            if (error || !data) {
                setErrorMsg('Invalid Membership or ID not found.');
            } else {
                if (data.status !== 'active') {
                    setErrorMsg(`Membership Found but status is ${data.status.toUpperCase()}`);
                } else {
                    setResult(data);
                }
            }


        } catch (err: any) {
            setErrorMsg(err.message || 'Error verifying code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
            {/* Header */}
            <header className="bg-[#0A402F] px-4 py-4 flex items-center shadow-lg">
                <button onClick={() => onNavigate('home')} className="text-[#FEFDF5] mr-4 hover:bg-white/10 p-2 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-[#FEFDF5] font-['Lora'] font-medium text-lg">Admin Scanner</h2>
            </header>

            {/* Content */}
            <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full">

                {/* Input Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">

                    {/* Toggle Camera Button */}
                    {!isScanning ? (
                        <div className="flex justify-center mb-6">
                            <button
                                onClick={() => setIsScanning(true)}
                                className="bg-[#0A402F] text-white p-4 rounded-full shadow-lg hover:bg-[#0A402F]/90 transition-transform active:scale-95 flex flex-col items-center gap-2"
                            >
                                <Camera size={32} />
                                <span className="text-xs font-bold">START CAMERA</span>
                            </button>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <div id="reader" className="overflow-hidden rounded-xl border-2 border-[#0A402F] min-h-[300px] bg-black/5 relative"></div>
                            <Button
                                onClick={() => setIsScanning(false)}
                                variant="ghost"
                                className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                                Stop Camera
                            </Button>
                        </div>
                    )}

                    <div className="text-center mb-4">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">- OR ENTER MANUALLY -</span>
                    </div>

                    <div className="space-y-4">
                        <Input
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            placeholder='Paste JSON or ID here...'
                            className="font-mono text-xs bg-gray-50 h-12"
                        />
                        <Button
                            onClick={() => handleScan()}
                            disabled={loading || !inputVal}
                            className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-12 text-lg rounded-xl"
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </Button>
                    </div>
                </div>

                {/* Results */}
                {cameraError && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 mb-4">
                        <XCircle size={48} className="text-orange-500 mb-3" />
                        <h3 className="font-bold text-orange-700 text-lg">Camera Issue</h3>
                        <p className="text-orange-600 text-center">{cameraError}</p>
                    </div>
                )}

                {errorMsg && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
                        <XCircle size={48} className="text-red-500 mb-3" />
                        <h3 className="font-bold text-red-700 text-lg">Access Denied</h3>
                        <p className="text-red-600 text-center">{errorMsg}</p>
                    </div>
                )}

                {result && (
                    <div className="bg-[#F0FDF4] border border-green-200 rounded-xl p-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
                        <CheckCircle size={48} className="text-green-500 mb-3" />
                        <h3 className="font-bold text-green-700 text-2xl mb-1">Access Granted</h3>
                        <p className="text-green-600 font-medium mb-4">{result.tier}</p>

                        <div className="w-full bg-white/50 rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Name:</span>
                                <span className="font-bold text-gray-800">{result.full_name || 'N/A'}</span>
                            </div>
                            {result.company_name && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Company:</span>
                                    <span className="font-bold text-gray-800 text-right">{result.company_name}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-500">ID:</span>
                                <span className="font-mono text-gray-800">{result.id.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status:</span>
                                <span className="font-bold text-green-600 uppercase tracking-wider">{result.status}</span>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
