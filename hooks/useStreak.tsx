"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { usePrivy } from "@privy-io/react-auth";

export const useStreak = () => {
  const [streakCount, setStreakCount] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const { user } = usePrivy();

  useEffect(() => {
    if (!user) return;

    const fetchStreak = async () => {
      try {
        const response = await axios.get(`/api/streak?userId=${user.id}`);
        const { streakCount, lastGMDate } = response.data;

        setStreakCount(streakCount);

        const now = new Date();
        const utcNow = new Date(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate()
        );
        const lastGM = new Date(lastGMDate);
        const utcLastGM = new Date(
          lastGM.getUTCFullYear(),
          lastGM.getUTCMonth(),
          lastGM.getUTCDate()
        );

        if (utcNow > utcLastGM) {
          setButtonDisabled(false);
        } else {
          setButtonDisabled(true);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch streak:", error);
        setLoading(false);
      }
    };

    fetchStreak();
  }, [user]);

  const handleGMClick = async () => {
    if (!user || buttonDisabled) return;

    try {
      const response = await axios.post("/api/streak", {
        userId: user.id,
      });

      const { newStreakCount } = response.data;
      setStreakCount(newStreakCount);
      setButtonDisabled(true);
    } catch (error) {
      console.error("Failed to update streak:", error);
    }
  };

  return { streakCount, buttonDisabled, handleGMClick, loading };
};
