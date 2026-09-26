import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      maxLength: 100,
      default: "Anonymous Candidate",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      index: true,
      maxLength: 150,
    },
    category: {
      type: String,
      required: true,
      enum: ["payment", "login", "export", "builder", "other"],
      default: "other",
      index: true,
    },
    subject: {
      type: String,
      trim: true,
      maxLength: 250,
      default: "Support Request",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxLength: 4000,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    userRole: {
      type: String,
      default: "guest",
    },
    adminNotes: {
      type: String,
      trim: true,
      maxLength: 2000,
      default: "",
    },
    resolvedBy: {
      type: String,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    pageUrl: {
      type: String,
      default: "",
      maxLength: 300,
    },
    userAgent: {
      type: String,
      default: "",
      maxLength: 300,
    },
  },
  {
    timestamps: true,
  }
);

supportTicketSchema.index({
  ticketId: "text",
  email: "text",
  name: "text",
  subject: "text",
  message: "text",
});

export const SupportTicket = mongoose.model(
  "SupportTicket",
  supportTicketSchema
);
