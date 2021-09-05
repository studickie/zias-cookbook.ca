import { buildCheckFunction } from "express-validator";

export const checkBody = buildCheckFunction(['body']);