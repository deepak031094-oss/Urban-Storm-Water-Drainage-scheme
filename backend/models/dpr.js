const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: String,
  location: String,
  reportingPeriod: String,
  preparedBy: String,
  designation: String,
  date: Date
});

const dailyProgressSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  date: Date,
  workDescription: String,
  location: String,
  plannedQty: Number,
  completedQty: Number,
  unit: String,
  progressPercent: Number,
  remarks: String
});

const manpowerSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  date: Date,
  skilledWorkers: Number,
  unskilledWorkers: Number,
  supervisors: Number,
  engineers: Number,
  total: Number
});

const equipmentSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  date: Date,
  equipmentType: String,
  numberOfUnits: Number,
  hoursWorked: Number,
  status: String,
  remarks: String
});

const materialSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  date: Date,
  material: String,
  unit: String,
  planned: Number,
  used: Number,
  balance: Number,
  remarks: String
});

const issuesSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  date: Date,
  issue: String,
  impact: String,
  actionTaken: String,
  status: String,
  responsiblePerson: String
});

const safetySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  date: Date,
  observation: String,
  correctiveAction: String,
  status: String,
  remarks: String
});

const qualitySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  date: Date,
  checkPoint: String,
  specification: String,
  actual: String,
  status: String,
  remarks: String
});

const photoSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  date: Date,
  location: String,
  description: String,
  photoReference: String
});

module.exports = {
  Project: mongoose.model('Project', projectSchema),
  DailyProgress: mongoose.model('DailyProgress', dailyProgressSchema),
  Manpower: mongoose.model('Manpower', manpowerSchema),
  Equipment: mongoose.model('Equipment', equipmentSchema),
  Material: mongoose.model('Material', materialSchema),
  IssuesChallenges: mongoose.model('IssuesChallenges', issuesSchema),
  SafetyObservations: mongoose.model('SafetyObservations', safetySchema),
  QualityChecks: mongoose.model('QualityChecks', qualitySchema),
  PhotographicDocumentation: mongoose.model('PhotographicDocumentation', photoSchema)
};
