export function datesForCreate() {
  const date = new Date().getTime();
  const dateInTimeStamp = Math.round(date / 1000);
  return { createdAt: dateInTimeStamp, updatedAt: dateInTimeStamp };
}

export function unixTimestamp(): number {
  return Math.round(timeStampMilliseconds() / 1000);
}

function timeStampMilliseconds(): number {
  return new Date().getTime();
}

const BASE36_ALPHABETS: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function syncSleep(ms: number) {
  const timestamp = timeStampMilliseconds() + ms;
  while (timeStampMilliseconds() < timestamp);
}

export function MakeTimedIDUnique(): string {
  syncSleep(1);

  let base36: string = '';
  let num: number = Math.round(timeStampMilliseconds() * 1000);
  while (num != 0) {
    const idx = num % BASE36_ALPHABETS.length;
    num = Math.floor(num / BASE36_ALPHABETS.length);
    base36 = BASE36_ALPHABETS[idx] + base36;
  }
  return base36;
}
