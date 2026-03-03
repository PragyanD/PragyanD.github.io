export default function GamesHubApp({ darkTheme = false }) {
    return (
        <div className="w-full h-full flex items-center justify-center" style={{ background: darkTheme ? '#0a0a1e' : '#f7f8fb' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Games loading…</p>
        </div>
    );
}
