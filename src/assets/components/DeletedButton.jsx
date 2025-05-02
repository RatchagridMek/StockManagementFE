export default function DeletedButton() {
    return (
        <div
            style={{
                display: 'inline-block',
                backgroundColor: '#FF6762',       // light red
                color: '#700404',                 // dark red text
                padding: '0.4rem 1.5rem',
                borderRadius: '999px',           // pill shape
                border: '2px solid #888',        // gray border
                letterSpacing: '0.15rem',
                fontSize: '1rem',
                textAlign: 'center'
            }}
        >
            Deleted
        </div>
    )
}