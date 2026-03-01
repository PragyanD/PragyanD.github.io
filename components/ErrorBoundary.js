import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { crashed: false, error: null };
        this._keyHandler = null;
    }

    static getDerivedStateFromError(error) {
        return { crashed: true, error };
    }

    reset = () => this.setState({ crashed: false, error: null });

    componentDidUpdate(_, prevState) {
        if (this.state.crashed && !prevState.crashed) {
            this._keyHandler = () => this.reset();
            window.addEventListener('keydown', this._keyHandler, { once: true });
        } else if (!this.state.crashed && prevState.crashed) {
            if (this._keyHandler) window.removeEventListener('keydown', this._keyHandler);
        }
    }

    componentWillUnmount() {
        if (this._keyHandler) window.removeEventListener('keydown', this._keyHandler);
    }

    render() {
        if (this.state.crashed) {
            return (
                <div
                    className="fixed inset-0 z-[2000] flex flex-col items-start justify-center p-16 cursor-pointer"
                    style={{
                        background: "#0050ef",
                        color: "#fff",
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                        userSelect: "none",
                    }}
                    onClick={this.reset}
                >
                    <div style={{ fontSize: 80, lineHeight: 1, marginBottom: 20 }}>:(</div>

                    <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 16, maxWidth: 580 }}>
                        Your PDOS ran into a problem and needs to restart.
                    </h1>

                    <p style={{ fontSize: 15, opacity: 0.8, maxWidth: 540, marginBottom: 28, lineHeight: 1.6 }}>
                        We&apos;re collecting some error info, then we&apos;ll restart for you.
                    </p>

                    <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 36 }}>0% complete</p>

                    <p style={{ fontSize: 13, opacity: 0.65, maxWidth: 520, lineHeight: 1.8 }}>
                        For more information, complain to the nearest developer.<br />
                        If you see your recruiter, tell them this was on purpose.<br /><br />
                        Error code: <strong>PDOS_COMPONENT_KERNEL_PANIC</strong>
                    </p>

                    {this.state.error?.message && (
                        <p style={{
                            marginTop: 32,
                            fontSize: 10,
                            opacity: 0.45,
                            fontFamily: "'JetBrains Mono', monospace",
                            wordBreak: "break-all",
                            maxWidth: 540,
                        }}>
                            {this.state.error.message}
                        </p>
                    )}

                    <p style={{ position: "absolute", bottom: 48, left: 64, fontSize: 13, opacity: 0.6 }}>
                        Click anywhere or press any key to restart.
                    </p>

                    <div style={{
                        position: "absolute",
                        bottom: 40,
                        right: 64,
                        width: 80,
                        height: 80,
                        background: "rgba(255,255,255,0.18)",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        opacity: 0.5,
                        textAlign: "center",
                    }}>
                        scan for<br />more errors
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
