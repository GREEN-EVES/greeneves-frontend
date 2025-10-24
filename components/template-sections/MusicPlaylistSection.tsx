'use client';

import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Music, Plus, Heart, Play } from 'lucide-react';

export interface MusicPlaylistSectionProps {
  event: any;
  config?: {
    showRequestForm?: boolean;
    allowSuggestions?: boolean;
    showSpotifyEmbed?: boolean;
  };
}

interface Song {
  id: string;
  title: string;
  artist: string;
  suggestedBy?: string;
}

export const MusicPlaylistSection: React.FC<MusicPlaylistSectionProps> = ({
  event,
  config = {}
}) => {
  const { colors, fonts } = useTheme();
  const {
    showRequestForm = true,
    allowSuggestions = true,
    showSpotifyEmbed = false,
  } = config;

  const [playlist] = useState<Song[]>([
    { id: '1', title: 'Happy Birthday', artist: 'Stevie Wonder', suggestedBy: 'Party Classics' },
    { id: '2', title: 'Celebration', artist: 'Kool & The Gang', suggestedBy: 'Party Classics' },
    { id: '3', title: 'Uptown Funk', artist: 'Bruno Mars', suggestedBy: 'Sarah J.' },
    { id: '4', title: 'Can\'t Stop The Feeling', artist: 'Justin Timberlake', suggestedBy: 'Mike C.' },
    { id: '5', title: 'September', artist: 'Earth, Wind & Fire', suggestedBy: 'Party Classics' },
  ]);

  const [songRequest, setSongRequest] = useState({ title: '', artist: '', name: '' });

  const handleSubmitSong = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Song request:', songRequest);
    setSongRequest({ title: '', artist: '', name: '' });
  };

  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music className="w-8 h-8" style={{ color: colors.primary }} />
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: fonts.heading, color: colors.primary }}
            >
              Party Playlist
            </h2>
          </div>
          <p
            className="text-lg"
            style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
          >
            Help us create the perfect soundtrack for this celebration!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Playlist */}
          <div>
            <h3
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: fonts.heading, color: colors.primary }}
            >
              Playlist
            </h3>
            <div className="space-y-3">
              {playlist.map((song, index) => (
                <div
                  key={song.id}
                  className="p-4 rounded-lg shadow hover:shadow-md transition-all group"
                  style={{
                    backgroundColor: '#fff',
                    borderLeft: `4px solid ${colors.primary}`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                      }}
                    >
                      <span
                        className="text-white font-bold"
                        style={{ fontFamily: fonts.heading }}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h4
                        className="font-semibold mb-1"
                        style={{ fontFamily: fonts.heading, color: colors.text || '#333' }}
                      >
                        {song.title}
                      </h4>
                      <p
                        className="text-sm mb-1"
                        style={{ color: colors.text ? `${colors.text}80` : '#666' }}
                      >
                        {song.artist}
                      </p>
                      {song.suggestedBy && (
                        <p
                          className="text-xs flex items-center gap-1"
                          style={{ color: colors.accent }}
                        >
                          <Heart className="w-3 h-3" />
                          Suggested by {song.suggestedBy}
                        </p>
                      )}
                    </div>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full"
                      style={{ backgroundColor: `${colors.primary}20` }}
                    >
                      <Play
                        className="w-5 h-5"
                        style={{ color: colors.primary }}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Spotify Embed */}
            {showSpotifyEmbed && (
              <div className="mt-6">
                <div
                  className="p-6 rounded-lg text-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}10 100%)`,
                  }}
                >
                  <Music
                    className="w-12 h-12 mx-auto mb-3"
                    style={{ color: colors.accent }}
                  />
                  <p
                    style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
                  >
                    Listen to the full playlist on Spotify
                  </p>
                  <button
                    className="mt-4 py-2 px-6 rounded-full font-semibold hover:opacity-90 transition-opacity"
                    style={{
                      backgroundColor: colors.primary,
                      color: '#fff',
                      fontFamily: fonts.body,
                    }}
                  >
                    Open Spotify
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Song Request Form */}
          {allowSuggestions && showRequestForm && (
            <div>
              <h3
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: fonts.heading, color: colors.primary }}
              >
                Request a Song
              </h3>
              <div
                className="p-8 rounded-lg shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`,
                }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Plus
                    className="w-6 h-6"
                    style={{ color: colors.accent }}
                  />
                  <p
                    style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
                  >
                    Have a song that gets the party started? Let us know!
                  </p>
                </div>

                <form onSubmit={handleSubmitSong} className="space-y-4">
                  <div>
                    <label
                      htmlFor="song-title"
                      className="block mb-2 font-medium"
                      style={{ fontFamily: fonts.body, color: colors.text || '#333' }}
                    >
                      Song Title
                    </label>
                    <input
                      id="song-title"
                      type="text"
                      value={songRequest.title}
                      onChange={(e) => setSongRequest({ ...songRequest, title: e.target.value })}
                      placeholder="Enter song title"
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
                      style={{
                        fontFamily: fonts.body,
                        borderColor: `${colors.primary}40`,
                        backgroundColor: '#fff',
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="song-artist"
                      className="block mb-2 font-medium"
                      style={{ fontFamily: fonts.body, color: colors.text || '#333' }}
                    >
                      Artist
                    </label>
                    <input
                      id="song-artist"
                      type="text"
                      value={songRequest.artist}
                      onChange={(e) => setSongRequest({ ...songRequest, artist: e.target.value })}
                      placeholder="Enter artist name"
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
                      style={{
                        fontFamily: fonts.body,
                        borderColor: `${colors.primary}40`,
                        backgroundColor: '#fff',
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="requester-name"
                      className="block mb-2 font-medium"
                      style={{ fontFamily: fonts.body, color: colors.text || '#333' }}
                    >
                      Your Name
                    </label>
                    <input
                      id="requester-name"
                      type="text"
                      value={songRequest.name}
                      onChange={(e) => setSongRequest({ ...songRequest, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
                      style={{
                        fontFamily: fonts.body,
                        borderColor: `${colors.primary}40`,
                        backgroundColor: '#fff',
                      }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    style={{
                      backgroundColor: colors.primary,
                      color: '#fff',
                      fontFamily: fonts.body,
                    }}
                  >
                    <Music className="w-5 h-5" />
                    Add to Playlist
                  </button>
                </form>

                <div
                  className="mt-6 p-4 rounded-lg text-center"
                  style={{
                    backgroundColor: `${colors.accent}20`,
                  }}
                >
                  <p
                    className="text-sm"
                    style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
                  >
                    All requests will be reviewed and added to the playlist
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
