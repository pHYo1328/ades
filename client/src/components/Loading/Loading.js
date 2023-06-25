import { FadeLoader } from 'react-spinners';

export default function Loading() {
    return (
        <div className="mx-auto flex flex-col items-center">
            <FadeLoader
                color={'navy'}
                loading={true}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            <p>Loading...</p>
        </div>
    );
}