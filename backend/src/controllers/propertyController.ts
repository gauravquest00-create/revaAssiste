import { Request, Response } from "express";
import { Property } from "../models/Property.js";
import { Project } from "../models/Project.js";

export const getProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const { project, bhk, minPrice, maxPrice, status, furnishing, includeArchived } = req.query;
    const filter: any = {};

    if (includeArchived !== "true") {
      filter.isArchived = { $ne: true };
    }

    if (project) filter.project = project;
    if (bhk) filter.bhk = bhk;
    if (status) filter.status = status;
    if (furnishing) filter.furnishing = furnishing;
    if (minPrice || maxPrice) {
      filter.askingPrice = {};
      if (minPrice) filter.askingPrice.$gte = Number(minPrice);
      if (maxPrice) filter.askingPrice.$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter).sort({ askingPrice: 1 });
    res.json({ success: true, count: properties.length, properties });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      res.status(404).json({ success: false, message: "Property unit not found" });
      return;
    }

    const project = await Project.findById(property.project);
    res.json({ success: true, property, project });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, message: "Property created successfully", property });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!property) {
      res.status(404).json({ success: false, message: "Property unit not found" });
      return;
    }
    res.json({ success: true, message: "Property updated successfully", property });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const archiveProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      res.status(404).json({ success: false, message: "Property not found" });
      return;
    }
    property.isArchived = !property.isArchived;
    await property.save();
    res.json({ success: true, message: `Property ${property.isArchived ? "archived" : "restored"}`, property });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Property unit removed" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const duplicateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const original = await Property.findById(req.params.id);
    if (!original) {
      res.status(404).json({ success: false, message: "Property not found" });
      return;
    }

    const cloneData = original.toObject();
    delete (cloneData as any)._id;
    delete (cloneData as any).createdAt;
    delete (cloneData as any).updatedAt;
    cloneData.propertyId = `${original.propertyId}-COPY-${Date.now().toString().slice(-4)}`;
    cloneData.unit = `${original.unit}-B`;

    const duplicate = await Property.create(cloneData);
    res.status(201).json({ success: true, message: "Property duplicated successfully", property: duplicate });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const smartImportProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows, confirm } = req.body;

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(400).json({ success: false, message: "No data rows provided for smart import." });
      return;
    }

    const validRows: any[] = [];
    const invalidRows: any[] = [];
    const duplicates: any[] = [];

    const existingIds = new Set((await Property.find().select("propertyId")).map(p => p.propertyId));

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const pId = r.propertyId || r.PropertyId || `PROP-IMP-${i + 1}`;
      const askingPrice = Number(r.askingPrice || r.Price || r.asking_price || 0);

      if (existingIds.has(pId)) {
        duplicates.push({ row: i + 1, data: r, reason: "Duplicate Property ID" });
      } else if (!askingPrice || !r.projectName) {
        invalidRows.push({ row: i + 1, data: r, reason: "Missing asking price or project name" });
      } else {
        validRows.push(r);
      }
    }

    if (!confirm) {
      res.json({
        success: true,
        previewOnly: true,
        summary: {
          total: rows.length,
          valid: validRows.length,
          invalid: invalidRows.length,
          duplicates: duplicates.length
        },
        validRows,
        invalidRows,
        duplicates
      });
      return;
    }

    const importedDocs = [];
    for (const row of validRows) {
      let project = await Project.findOne({ name: { $regex: row.projectName, $options: "i" } });
      if (!project) {
        project = await Project.findOne({ name: "Tata La Vida" });
      }

      const doc = await Property.create({
        propertyId: row.propertyId || `IMP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
        project: project?._id,
        projectName: project?.name || row.projectName,
        corridor: project?.corridor,
        corridorName: project?.corridorName || "Dwarka Expressway",
        tower: row.tower || "Tower A",
        floor: Number(row.floor) || 12,
        unit: row.unit || "1202",
        bhk: row.bhk || "3 BHK",
        area: Number(row.area) || 1650,
        facing: row.facing || "Park Facing",
        view: row.view || "Open Green",
        furnishing: row.furnishing || "Semi-Furnished",
        parking: row.parking || "2 Covered Dedicated",
        askingPrice: Number(row.askingPrice) || 21000000,
        expectedPrice: Number(row.expectedPrice) || 20500000,
        lowestExpectedPrice: Number(row.lowestExpectedPrice) || 20000000,
        pricePerSqft: Number(row.pricePerSqft) || 12727,
        seller: {
          name: row.sellerName || "Verified Individual",
          contact: row.sellerContact || "Not verified",
          urgency: row.sellerUrgency || "Moderate",
          brokeragePercentage: 1.0
        },
        availability: "Available",
        verificationStatus: "Verified",
        status: "Available"
      });
      importedDocs.push(doc);
    }

    res.json({
      success: true,
      message: `Successfully imported ${importedDocs.length} properties.`,
      importedCount: importedDocs.length
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
