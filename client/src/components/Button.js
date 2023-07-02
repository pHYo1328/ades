export default function Button({ content, onClick, buttonRef }) {
    return (
        <button
            className="bg-dark-blue hover:bg-light-blue text-white font-bold py-2 px-4 rounded-sm w-full text-sm h-100"
            onClick={onClick}
            ref={buttonRef}
        >
            {content}
        </button>
    )
}