import React, { useEffect, useMemo, useState } from "react";
import { Box, Stack, Typography, Alert, CircularProgress, Fade } from "@mui/material";

import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos, Sidebar } from "./";

const PlaylistFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState("Match");
  const [videos, setVideos] = useState(null);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const playlistMap = useMemo(
    () => ({
      Match: process.env.REACT_APP_MATCHES_PLAYLIST_ID,
      "Feedback": process.env.REACT_APP_FEEDBACK_PLAYLIST_ID,
    }),
    []
  );

  useEffect(() => {
    const playlistId = playlistMap[selectedCategory];
    setVideos(null);
    setError(null);
    setShowError(false);
    setLoading(true);

        console.log("=== DEBUG INFO ===");
    console.log("Selected category:", selectedCategory);
    console.log("Playlist ID for category:", playlistId);
    console.log("PlaylistMap object:", playlistMap);
    console.log("All environment variables:");
    console.log(
      "- REACT_APP_YOUTUBE_API_KEY:",
      process.env.REACT_APP_YOUTUBE_API_KEY ? "EXISTS" : "MISSING"
    );
    console.log(
      "- REACT_APP_MATCHES_PLAYLIST_ID:",
      process.env.REACT_APP_MATCHES_PLAYLIST_ID || "MISSING"
    );
    console.log(
      "- REACT_APP_FEEDBACK_PLAYLIST_ID:",
      process.env.REACT_APP_FEEDBACK_PLAYLIST_ID || "MISSING"
    );
    console.log("==================");

    if (playlistId && playlistId !== "undefined" && playlistId !== "") {
      fetchFromAPI(`playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`)
        .then((data) => {
          if (data.items && data.items.length > 0) {
            setVideos(data.items);
          } else {
            setVideos([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching playlist videos:", error);
          setError("Failed to load videos. Please try again later.");
          setShowError(true);
          setVideos([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setVideos([]);
      setLoading(false);
    }
  }, [selectedCategory, playlistMap]);

  // Automatically hide error after 5 seconds
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  return (
    <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
      {/* Sidebar */}
      <Box
        sx={{
          height: { sx: "auto", md: "92vh" },
          borderRight: "1px solid #3d3d3d",
          px: { sx: 0, md: 2 },
        }}
      >
        <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2 }}>
          <img
            src="/logo-32x32.png"
            alt="Portal Logo"
            style={{ width: "32px", height: "32px", marginRight: "8px" }}
          />
          <Typography className="copyright" variant="body2" sx={{ color: "#fff" }}>
            Portal v1.0
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box p={2} sx={{ overflowY: "auto", height: "90vh", flex: 2 }}>
        <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
          {selectedCategory} <span style={{ color: "#67cbff" }}>videos</span>
        </Typography>

        {/* Error Alert with fade animation */}
        <Fade in={showError} timeout={{ enter: 500, exit: 500 }}>
          <Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Fade>

        {/* Loading Spinner */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress color="inherit" />
          </Box>
        )}

        {/* No Videos Message */}
        {!loading && !error && videos && videos.length === 0 && (
          <Typography variant="h6" sx={{ color: "gray", textAlign: "center", mt: 4 }}>
            No videos available.
          </Typography>
        )}

        {/* Videos */}
        {!loading && !error && videos && videos.length > 0 && <Videos videos={videos} />}
      </Box>
    </Stack>
  );
};

export default PlaylistFeed;
