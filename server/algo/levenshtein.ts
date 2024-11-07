// distance.ts

export function leven_distance(s1: string, s2: string): number {
    const lenS1 = s1.length;
    const lenS2 = s2.length;
    const dp: number[][] = Array.from({ length: lenS1 + 1 }, () => new Array(lenS2 + 1).fill(0));

    for (let i = 0; i <= lenS1; i++) {
        for (let j = 0; j <= lenS2; j++) {
            if (i === 0) {
                dp[i][j] = j;
            } else if (j === 0) {
                dp[i][j] = i;
            } else if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }

    return dp[lenS1][lenS2];
}