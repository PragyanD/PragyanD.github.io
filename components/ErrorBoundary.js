import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { crashed: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { crashed: true, error };
    }

    reset = () => this.setState({ crashed: false, error: null });

    render() {
        if (this.state.crashed) {
            return (
                <div className="flex flex-col items-center justify-center h-full bg-[#1a0a0a] text-red-400 font-mono p-6 gap-4">
                    <span className="text-2xl">⚠</span>
                    <p className="text-xs text-center opacity-70">This app crashed.</p>
                    <p className="text-[10px] text-red-300/40 text-center max-w-[240px] break-words">
                        {this.state.error?.message}
                    </p>
                    <button
                        onClick={this.reset}
                        className="px-4 py-1.5 text-xs rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
