import React from "react";
import { Stack, Box } from "@mui/material";

import { ChannelCard, Loader, VideoCard } from "./";

const Videos = ({ videos, direction }) => {
  console.log('Videos component received:', videos);
  console.log('Videos length:', videos?.length);
  
  if(!videos?.length) {
    console.log('No videos, showing loader');
    return <Loader />;
  }
  
  return (
    <Stack direction={direction || "row"} flexWrap="wrap" justifyContent="start" alignItems="start" gap={2}>
      {videos.map((item, idx) => {
        const videoId = item?.id?.videoId || item?.snippet?.resourceId?.videoId;
        const channelId = item?.id?.channelId || item?.snippet?.channelId;
        
        console.log(`Item ${idx}:`, {
          videoId,
          channelId,
          hasVideoId: !!videoId,
          hasChannelId: !!channelId,
          itemStructure: item
        });

        return (
          <Box key={idx}>
            {videoId && <VideoCard video={{ id: { videoId }, snippet: item.snippet }} />}
            {channelId && !videoId && <ChannelCard channelDetail={item} />}
          </Box>
        );
      })}
    </Stack>
  );
}

export default Videos;
