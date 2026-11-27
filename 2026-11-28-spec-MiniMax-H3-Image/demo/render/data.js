// 공식 자료 값 (2026-11-28 확인) — 영상·썸네일 숫자는 여기서만 가져옴. 직접 실행·측정한 값 아님
// 모델 카드·LICENSE https://huggingface.co/MiniMaxAI/MiniMax-H3-Image · 블로그 https://www.minimax.io/blog/minimax-h3-image
// diffusers 문서 https://huggingface.co/docs/diffusers/main/en/api/pipelines/minimax_h3_image · ComfyUI 안내 https://docs.comfy.org/tutorials/image/minimax/minimax-h3-image
const SPEC = {
  gpuGiB: 80,                         // diffusers 문서: 두 덩이가 80GB 그래픽카드에 같이 안 들어감
  part: 62, peak: 65, peakShape: '4736×3552',   // diffusers 문서: 각 약 62GB(bfloat16) · 자동 오프로드로 최고 약 65GB
  dit: 66.28, te: 66.7, vae: 2.34, disk: 135, pe: 17.9,            // 모델 카드 내려받기 표 (GB) · 합계 약 135GB(계산)
  comfy: { dit: 21, te: 25.28, vae: 1.17, pe: 7.34, sum: 47 },     // ComfyUI 공식 안내 (INT8 등) · 합계 약 47GB(계산, 글 다듬기 도우미 빼고)
  params: '33.1B', steps: 6, refs: 16, mp: 16, res: ['4096×4096 (1:1)', '6272×2688 (21:9)'], smallMp: 4,
  speed: '4K(4096×4096) 1장 10초 이내',
  stars: 477, forks: 28, hfDownloads: 1036133, hfLikes: '2.59k', released: '2026-11-09',
  excluded: ['유럽연합(EU)', '영국', '대한민국', '미국'], licDate: '2026-11-10', revenue: '연 매출 100만 달러 초과',
};
