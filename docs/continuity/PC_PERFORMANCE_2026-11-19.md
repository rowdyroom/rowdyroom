# PC performance tuning — November 19, 2026

Status: in progress. This is a measured first pass, not full live-show, cooling, memory-overclock, or production-team acceptance.

Roger's established show workflow is the YouTube-based host queue. Retain the single table-first queue, row Actions, TV Mode, lyrics path, voting and history. The authoritative queue record remains `rowdy-room/simple-host-queue-2026-11-03`; its public branch is unmerged. Roger plans to use local AI alongside shows once the production team is ready. Do not ask him to re-identify this established workflow.

## Verified first pass

Live Windows inventory: Ryzen 9 9950X, ProArt X870E-CREATOR WIFI, BIOS 2402, 32 GB memory at 4800 MT/s, RTX 5060 Ti 16 GB and RTX 3070 8 GB. The two GPU memory capacities are separate resources. The Yamaha AG06MK2 is present with its native USB audio service. Storage and device health queries report no current device fault; all four local NVMe volumes report healthy.

A reversible Rowdy Production power plan duplicates the original Balanced plan and disables AC USB selective suspend and PCIe link power management. The original plan is unchanged and exported; a restore script is retained privately. CPU policy and the existing no-sleep setting are preserved. This is a device-power configuration change, not a demonstrated compute speedup.

The retained `psyche-pc-compute-v2` benchmark completed CPU 1/16/32-thread, memory-copy, and FP32/FP16 tests on both permanent GPUs before and after the change. All requested numerical checks passed. The second run included LatencyMon, so this is not an isolated A/B experiment. Throughput ratios ranged approximately 0.95–1.05; no robust speed improvement is established. The 16-thread CPU result exceeded the 32-thread result in the baseline; this does not establish the best thread count for every model.

LatencyMon initially reported suitability, then raised a real-time audio warning. At the retained 3:53 observation, maximum interrupt-to-process latency was 1072.6 microseconds; maximum DPC was 556.966216 microseconds, and maximum ISR 24.736021 microseconds. The sample included desktop activity and a synthetic compute benchmark. It does not prove an audible failure in the YouTube queue path. Elevated-window input was ineffective; owner stop and detailed report preservation were requested. No completed show acceptance is claimed.

## Remaining work

- Preserve the full latency report and compare controlled runs using the same workload.
- Test the established YouTube queue and Yamaha audio path with a bounded local AI workload, without changing live queue state or financial records.
- Verify current cooling and pump/fan behavior. The current Radiograph view did not expose usable CPU temperature readings.
- Read actual memory profile, full kit identity and DIMM placement in firmware before selecting a supported profile. The Windows part number begins F5-6000J3636F16G; a 6000-rated part name alone does not prove an available EXPO profile or stable operating settings.
- Run appropriate stability checks after any firmware change. No BIOS, voltage, CPU/GPU overclock, firmware flash, security, or production-routing change has been applied.

Protected authority: `rowdy-room/pc-performance-2026-11-19`. Dated local recovery and raw measurements remain private. Final live-show and future concurrent-AI acceptance remain recovery-required.
