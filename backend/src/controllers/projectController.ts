import { Request, Response } from "express";
import { Project } from "../models/Project.js";
import { Property } from "../models/Property.js";
import { GeminiService } from "../services/ai/geminiService.js";

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, sector, status, minPrice, maxPrice, configuration, includeArchived } = req.query;
    const filter: any = {};

    if (includeArchived !== "true") {
      filter.isArchived = { $ne: true };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { builder: { $regex: search as string, $options: "i" } },
        { sector: { $regex: search as string, $options: "i" } }
      ];
    }

    if (sector) filter.sector = sector;
    if (status) filter.status = status;
    if (configuration) filter.configurations = configuration;
    if (minPrice || maxPrice) {
      filter["priceRange.min"] = { $lte: Number(maxPrice) || 100000000 };
      filter["priceRange.max"] = { $gte: Number(minPrice) || 0 };
    }

    const projects = await Project.find(filter).sort({ name: 1 });
    res.json({ success: true, count: projects.length, projects });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    const properties = await Property.find({ project: project._id, status: "Available", isArchived: { $ne: true } });

    res.json({ success: true, project, properties });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProjectIntelligence = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    const properties = await Property.find({ project: project._id, status: "Available" });
    const aiAnalysis = await GeminiService.analyzeProject(project);

    res.json({
      success: true,
      project,
      properties,
      intelligence: aiAnalysis
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getQuickPitch = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    const [pitch, analysis, properties] = await Promise.all([
      GeminiService.generateSalesPitch(project),
      GeminiService.analyzeProject(project),
      Property.find({ project: project._id, status: "Available" }).limit(5)
    ]);

    res.json({
      success: true,
      quickPitch: {
        corridor: project.corridorName,
        project: project.name,
        builder: project.builder,
        sector: project.sector,
        priceRange: project.priceRange?.formatted || "₹1.8 Cr - ₹3.5 Cr",
        configurations: project.configurations,
        amenities: project.amenities.slice(0, 5),
        usp: project.usp,
        rentalYield: project.rentalIntelligence.expectedYield,
        marketTrend: project.investmentIntelligence.threeYearAppreciation,
        projectStatus: project.status,
        recommendedSellingAngle: analysis.recommendedSellingAngle,
        salesPitch: pitch,
        clientQuestions: analysis.frequentlyAskedQuestions,
        alternativeProjects: analysis.alternativeProjects,
        linkedProperties: properties
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectData = req.body;
    if (!projectData.slug && projectData.name) {
      projectData.slug = projectData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    
    // Check if project already exists by name or slug
    const existing = await Project.findOne({
      $or: [{ name: projectData.name }, { slug: projectData.slug }]
    });

    if (existing) {
      // Update existing project and return
      const updated = await Project.findByIdAndUpdate(existing._id, projectData, { new: true });
      res.status(200).json({
        success: true,
        message: "Project already exists and has been updated in database",
        project: updated,
        alreadyExisted: true
      });
      return;
    }

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, message: "Project created and saved to database successfully", project });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }
    res.json({ success: true, message: "Project updated successfully", project });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const archiveProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }
    project.isArchived = !project.isArchived;
    await project.save();
    res.json({ success: true, message: `Project ${project.isArchived ? "archived" : "restored"}`, project });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Project permanently deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
