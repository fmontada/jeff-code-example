import { YoutubeEmbedTestIds } from './YoutubeEmbedTestIds';

export interface IYoutubeEmbedProps {
    captionTitle: string;
    youtubeVideoUrl: string;
}

export function YoutubeEmbed({
    captionTitle,
    youtubeVideoUrl,
}: IYoutubeEmbedProps) {
    function getYoutubeId(url: string) {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return match && match[2].length === 11 ? match[2] : null;
    }

    const youtubeId = getYoutubeId(youtubeVideoUrl);

    if (!youtubeId) {
        console.error('Invalid Youtube URL');
        return null;
    }

    return (
        <div
            className="overflow-hidden pb-[56.25%] relative h-0 rounded-lg"
            data-testid={YoutubeEmbedTestIds.YOUTUBE_CONTAINER}
        >
            <iframe
                width="800"
                height="450"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="left-0 top-0 h-full w-full absolute"
                data-testid={YoutubeEmbedTestIds.YOUTUBE_EMBED}
                title={captionTitle}
            />
        </div>
    );
}
