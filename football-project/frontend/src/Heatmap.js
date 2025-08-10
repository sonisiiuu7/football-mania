// src/Heatmap.js
import React, { useEffect, useRef } from 'react';
import h337 from 'heatmap.js';

const pitchImage = 'https://media.contentapi.ea.com/content/dam/ea/fifa/fifa-21/news/common/pitch-notes-pre-season-deep-dive/pitch-background-xl.jpg';

const Heatmap = ({ teamsData }) => {
    const heatmapContainerRef = useRef(null);
    const heatmapInstanceRef = useRef(null);

    useEffect(() => {
        if (heatmapContainerRef.current && teamsData && teamsData.length > 0) {
            if (!heatmapInstanceRef.current) {
                heatmapInstanceRef.current = h337.create({
                    container: heatmapContainerRef.current,
                    radius: 35,
                    maxOpacity: 0.9,
                    minOpacity: 0.1,
                    blur: .90,
                    // Define a gradient with two main colors for the two teams
                    gradient: {
                        '.5': 'blue', // Color for home team
                        '.9': 'red'   // Color for away team
                    }
                });
            }

            const points = [];
            
            // Process Home Team (first team in the array)
            const homeTeam = teamsData[0];
            if (homeTeam) {
                homeTeam.players.forEach(() => {
                    const avgX = Math.floor(Math.random() * 300) + 40; // Left side of pitch
                    const avgY = Math.floor(Math.random() * 950) + 50;
                    points.push({ x: avgX, y: avgY, value: 50 }); // Home team value
                });
            }

            // Process Away Team (second team in the array)
            const awayTeam = teamsData[1];
            if (awayTeam) {
                awayTeam.players.forEach(() => {
                    const avgX = Math.floor(Math.random() * 300) + 340; // Right side of pitch
                    const avgY = Math.floor(Math.random() * 950) + 50;
                    points.push({ x: avgX, y: avgY, value: 100 }); // Away team value (higher to trigger second color)
                });
            }

            heatmapInstanceRef.current.setData({
                max: 100, // Max value to control gradient
                data: points
            });
        }
    }, [teamsData]);

    return (
        <div
            ref={heatmapContainerRef}
            className="heatmap-container"
            style={{
                backgroundImage: `url(${pitchImage})`,
                width: '680px',
                height: '1050px',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                margin: 'auto',
                position: 'relative'
            }}
        >
        </div>
    );
};

export default Heatmap;