// Full Motion feature set (adds drag + layout to the default domAnimation).
// Loaded lazily by components that need it, e.g. <LazyMotion features={loadDomMax}> in Draggable.
import { domMax } from "motion/react";

export default domMax;
