import momentLib from 'moment';

type MomentDurationFormatInit = (moment: typeof momentLib) => void;

type MomentDurationFormatModule =
  | MomentDurationFormatInit
  | { default: MomentDurationFormatInit };

/**
 * Loads moment-duration-format when installed (optional peer dependency).
 */
function loadDurationFormatInit(): MomentDurationFormatInit | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, global-require
    const mod = require('moment-duration-format') as MomentDurationFormatModule;
    return typeof mod === 'function' ? mod : mod.default;
  } catch {
    return null;
  }
}

/**
 * Patches moment with duration formatting from moment-duration-format.
 */
export function setupMomentDurationFormat(momentRef: typeof momentLib): void {
  if (!momentRef) {
    throw new Error(
      '[react-moment] Duration formatting requires moment. '
      + 'Install the moment package before using duration formatting features.'
    );
  }

  const durationFormatInit = loadDurationFormatInit();
  if (!durationFormatInit) {
    return;
  }

  try {
    durationFormatInit(momentRef);
  } catch (error) {
    if (typeof error === 'string') {
      throw new Error(`[react-moment] ${error}`);
    }
    throw error;
  }
}
