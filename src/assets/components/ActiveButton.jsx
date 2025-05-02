export default function ActiveButton() {
    return (
        <div
            style={{
                display: 'inline-block',
                backgroundColor: '#85FA97',       // light green
                color: '#078F44',                 // dark green text
                padding: '0.4rem 1.5rem',
                borderRadius: '999px',           // pill shape
                border: '2px solid #888',        // gray border
                letterSpacing: '0.15rem',
                fontSize: '1rem',
                textAlign: 'center'
            }}
        >
            ACTIVE
        </div>
    )
}