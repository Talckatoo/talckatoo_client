// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Messages {
    createdAt?: string | null;
    message: string;
    audioURL: string;
    sender: string | null;
    _id: string;
  }

