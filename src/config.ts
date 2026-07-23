import express, { NextFunction } from "express";
import { Request, Response } from "express";

type APIConfig = {
    fileserverHits: number;
};

export const config:APIConfig = {
    fileserverHits: 0
}