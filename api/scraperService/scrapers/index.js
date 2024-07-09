const METScraper = require('./METScraper');
const VAScraper = require('./VAScraper');
const CAMScraper = require('./CAMScraper');
const PHILAScraper = require('./PHILAScraper');
const LACMAScraper = require('./LACMAScraper');
const FITScraper = require('./FITScraper');
const ROMScraper = require('./ROMScraper');
const CWScraper = require('./CWScraper');
const MFABScraper = require('./MFABScraper');
const MCCORDScraper = require('./MCCORDScraper');
const FIDMScraper = require('./FIDMScraper')

module.exports = {
  MET: METScraper,
  VA: VAScraper,
  CAM: CAMScraper,
  PHILA: PHILAScraper,
  LACMA: LACMAScraper,
  FIT: FITScraper,
  ROM: ROMScraper,
  CW: CWScraper,
  MFAB: MFABScraper,
  MCCORD: MCCORDScraper,
  FIDM: FIDMScraper
};
