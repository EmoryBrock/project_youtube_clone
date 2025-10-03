import React, { useEffect, useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";

import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos, Sidebar } from "./";

const PlaylistFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState("Matches");
  const [videos, setVideos] = useState(null);

  // Map categories to playlist IDs (memoized to avoid recreating on each render)
  const playlistMap = useMemo(() => ({
    "Matches": process.env.REACT_APP_MATCHES_PLAYLIST_ID,
    "Play Feedback": process.env.REACT_APP_FEEDBACK_PLAYLIST_ID,
  }), []);

  useEffect(() => {
    setVideos(null);
    
    const playlistId = playlistMap[selectedCategory];
    
    // Debug logging
    console.log('=== DEBUG INFO ===');
    console.log('Selected category:', selectedCategory);
    console.log('Playlist ID for category:', playlistId);
    console.log('PlaylistMap object:', playlistMap);
    console.log('All environment variables:');
    console.log('- REACT_APP_YOUTUBE_API_KEY:', process.env.REACT_APP_YOUTUBE_API_KEY ? 'EXISTS' : 'MISSING');
    console.log('- REACT_APP_MATCHES_PLAYLIST_ID:', process.env.REACT_APP_MATCHES_PLAYLIST_ID || 'MISSING');
    console.log('- REACT_APP_FEEDBACK_PLAYLIST_ID:', process.env.REACT_APP_FEEDBACK_PLAYLIST_ID || 'MISSING');
    console.log('==================');
    
    if (playlistId && playlistId !== 'undefined' && playlistId !== '') {
      console.log('Fetching videos for playlist:', playlistId);
      fetchFromAPI(`playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`)
        .then((data) => {
          console.log('API Response:', data);
          console.log('API Response items:', data.items);
          console.log('Number of items:', data.items ? data.items.length : 0);
          if (data.items && data.items.length > 0) {
            console.log('First item structure:', data.items[0]);
            console.log('First item videoId:', data.items[0]?.snippet?.resourceId?.videoId);
          }
          setVideos(data.items || []);
        })
        .catch((error) => {
          console.error('Error fetching playlist videos:', error);
          setVideos([]);
        });
    } else {
      console.warn(`No playlist ID configured for category: ${selectedCategory}`);
      console.warn('PlaylistId value:', playlistId);
      setVideos([]);
    }
  }, [selectedCategory, playlistMap]);

  return (
    <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
      <Box sx={{ height: { sx: "auto", md: "92vh" }, borderRight: "1px solid #3d3d3d", px: { sx: 0, md: 2 } }}>
        <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
          <img 
            src="/logo-32x32.png" 
            alt="Portal Logo" 
            style={{ width: '32px', height: '32px', marginRight: '8px' }}
          />
          <Typography className="copyright" variant="body2" sx={{ color: "#fff" }}>
            Portal v1.0
          </Typography>
        </Box>
      </Box>

      <Box p={2} sx={{ overflowY: "auto", height: "90vh", flex: 2 }}>
        <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
          {selectedCategory} <span style={{ color: "#67cbff" }}>videos</span>
        </Typography>

        <Videos videos={videos} />
      </Box>
    </Stack>
  );
};

export default PlaylistFeed;
