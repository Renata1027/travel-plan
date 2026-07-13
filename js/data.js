export const tripData = {
  trip: {
    title: '待填写的旅行标题',
    coverImage: 'images/placeholder-cover.svg',
    tagline: '一句关于这趟旅行的话，之后替换成真的。',
  },
  days: [
    {
      date: '2026-08-01',
      title: 'Day 1 · 占位地点',
      items: [
        { time: '09:00', title: '占位行程项', transport: '待定', note: '' },
      ],
    },
  ],
  route: {
    waypoints: [
      { x: 10, y: 80, label: '出发地（占位）' },
      { x: 50, y: 40, label: '中转地（占位）' },
      { x: 90, y: 20, label: '目的地（占位）' },
    ],
  },
  budget: {
    currency: '¥',
    categories: [
      {
        name: '交通',
        items: [{ label: '占位交通费', amount: 0 }],
      },
      {
        name: '住宿',
        items: [{ label: '占位住宿费', amount: 0 }],
      },
    ],
  },
  destinations: [
    {
      name: '占位目的地',
      image: 'images/placeholder-destination.svg',
      summary: '一句简介，之后替换。',
      detail: '更详细的介绍文字，之后替换。',
    },
  ],
};
