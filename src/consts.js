const BUF_SIZE = 256;
export default {
    BUF_SIZE,
    adsrProperties: [
        {
            name: 'attack',
            suffix: 's',
            maxVal: 10
        },
        {
            name: 'decay',
            suffix: 's',
            maxVal: 10
        },
        {
            name: 'sustain',
            maxVal: 2
        },
        {
            name: 'release',
            suffix: 's',
            maxVal: 30,
        }
    ],
    initialWave: new Array(BUF_SIZE)
        .fill(0)
        .map((val, i) => Math.sin(i / BUF_SIZE * Math.PI * 2)),
    MAX_BEATS: 16
}
