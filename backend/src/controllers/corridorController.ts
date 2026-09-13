import { Request, Response } from "express";
import { Corridor } from "../models/Corridor.js";
import { Project } from "../models/Project.js";

export const getCorridors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { includeArchived } = req.query;
    const filter: any = {};
    if (includeArchived !== "true") {
      filter.isArchived = { $ne: true };
    }
    const corridors = await Corridor.find(filter).sort({ name: 1 });
    res.json({ success: true, corridors });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCorridorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const corridor = await Corridor.findById(req.params.id);
    if (!corridor) {
      res.status(404).json({ success: false, message: "Corridor not found" });
      return;
    }

    const projects = await Project.find({ corridor: corridor._id, isArchived: { $ne: true } }).select("name sector builder priceRange status");

    res.json({
      success: true,
      corridor,
      projects
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCorridor = async (req: Request, res: Response): Promise<void> => {
  try {
    const corridor = await Corridor.create(req.body);
    res.status(201).json({ success: true, message: "Corridor created successfully", corridor });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateCorridor = async (req: Request, res: Response): Promise<void> => {
  try {
    const corridor = await Corridor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!corridor) {
      res.status(404).json({ success: false, message: "Corridor not found" });
      return;
    }
    res.json({ success: true, message: "Corridor updated successfully", corridor });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const archiveCorridor = async (req: Request, res: Response): Promise<void> => {
  try {
    const corridor = await Corridor.findById(req.params.id);
    if (!corridor) {
      res.status(404).json({ success: false, message: "Corridor not found" });
      return;
    }
    corridor.isArchived = !corridor.isArchived;
    await corridor.save();
    res.json({ success: true, message: `Corridor ${corridor.isArchived ? "archived" : "unarchived"}`, corridor });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCorridor = async (req: Request, res: Response): Promise<void> => {
  try {
    await Corridor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Corridor permanently deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
