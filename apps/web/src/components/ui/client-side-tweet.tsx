"use client";

import { TweetProps, useTweet } from "react-tweet";
import { MagicTweet } from "./Client-tweet";



export const ClientTweetCard = ({
    id,
    apiUrl,
    components,
    fetchOptions,
    ...props
}: TweetProps & { className?: string }) => {
    const { data, error, } = useTweet(id, apiUrl, fetchOptions);

    if (error || !data) {

        return <></>
    }

    return <MagicTweet tweet={data} components={components} {...props} />;
};
