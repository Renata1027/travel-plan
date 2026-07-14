export const tripData = {
  trip: {
    title: '北京・沙海草原周末自驾全攻略',
    coverImage: 'images/cover.jpg',
    tagline: '沙漠 · 草原 · 森林 · 公路，48 小时穿越四重地貌的周末自驾',
  },
  days: [
    {
      date: '2026-07-17',
      title: 'Day 1 · 夜行奔赴',
      items: [
        {
          time: '19:30',
          title: '北京城区出发',
          transport: '自驾',
          note: '沿大广高速→丹锡高速一路向北，全程约 500 公里，中途按需在服务区停靠休整、轮换驾驶，把长途通勤放在夜间。',
        },
        {
          time: '01:00',
          title: '抵达乌丹镇',
          transport: '自驾',
          note: '办理酒店入住，快速休整入睡，为次日穿沙自驾储备体力。',
        },
      ],
    },
    {
      date: '2026-07-18',
      title: 'Day 2 · 沙海穿越→草原日落',
      items: [
        {
          time: '10:30',
          title: '乌白穿沙公路自驾',
          transport: '自驾',
          note: '全程 91 公里，横贯科尔沁沙地腹地，沿途选安全停车区拍照，保持 40-60km/h 慢行，深度体验约 3 小时。',
        },
        {
          time: '13:00',
          title: '乌丹镇午餐 · 地道手把肉',
          transport: '步行',
          note: '科尔沁散养绵羊手把肉，搭配现灌血肠、清炒沙葱、咸奶茶与奶豆腐拼盘。',
        },
        {
          time: '14:00',
          title: '途经灯笼河草原',
          transport: '自驾',
          note: '连绵缓坡上矗立成片白色风力发电机，可下车漫步草甸，打卡风车群与金界壕古长城遗址，约 1 小时。',
        },
        {
          time: '17:00',
          title: '将军泡子看日落',
          transport: '自驾 + 步行',
          note: '乌兰布统经典日落取景地，湖面倒映晚霞，从日落前 1 小时抵达，守候完整落日过程，约 1.5 小时。',
        },
        {
          time: '19:00',
          title: '牧民家特色晚餐',
          transport: '步行',
          note: '蒙古包草原家宴：清炖羊排、蒙古酸菜包子、炒米拌奶茶、手掰羊肝。',
        },
        {
          time: '20:30',
          title: '草原篝火体验',
          transport: '步行',
          note: '围坐篝火，头顶漫天繁星与银河，草原旅行最具仪式感的一晚。',
        },
        {
          time: '22:00',
          title: '返回酒店休息',
          transport: '自驾',
          note: '',
        },
      ],
    },
    {
      date: '2026-07-19',
      title: 'Day 3 · 坝上精华→返程风光大道',
      items: [
        {
          time: '08:30',
          title: '草原早餐',
          transport: '步行',
          note: '现熬咸奶茶、香酥炸果子、水煮蛋、奶皮子，搭配小米粥与草原酱菜。',
        },
        {
          time: '09:00',
          title: '百草敖包',
          transport: '步行',
          note: '草原文化的信仰符号，可按传统绕敖包三圈祈福，上午光线柔和，游玩约 40 分钟。',
        },
        {
          time: '09:45',
          title: '乌兰布统影视基地',
          transport: '步行',
          note: '沿木栈道登上山顶观景台，俯瞰丘陵草原、白桦林与羊群，游玩约 1 小时；时间充裕可加游公主湖。',
        },
        {
          time: '11:00',
          title: '前往军马场镇',
          transport: '自驾',
          note: '车程约 20 分钟。',
        },
        {
          time: '11:30',
          title: '午餐 · 特色冰煮羊',
          transport: '步行',
          note: '六月龄羔羊肉铺在冰块上加热，锅底加红枣枸杞洋葱提鲜，先喝鲜羊汤再蘸麻酱韭花吃嫩肉。',
        },
        {
          time: '12:30',
          title: '启程返程 · 国家一号风景大道',
          transport: '自驾',
          note: '全程约 180 公里景观公路，串联草原、森林、湿地、山地多重地貌，全程免费，边走边看。',
        },
        {
          time: '19:30',
          title: '抵达北京城区',
          transport: '自驾',
          note: '行程圆满结束。',
        },
      ],
    },
  ],
  route: {
    waypoints: [
      { x: 12, y: 85, label: '北京出发' },
      { x: 28, y: 62, label: '乌丹镇' },
      { x: 42, y: 48, label: '灯笼河草原' },
      { x: 56, y: 28, label: '乌兰布统 · 将军泡子' },
      { x: 70, y: 20, label: '军马场镇' },
      { x: 82, y: 42, label: '国家一号风景大道' },
      { x: 20, y: 80, label: '返回北京' },
    ],
  },
  budget: {
    currency: '¥',
    categories: [
      {
        name: '交通',
        items: [
          { label: '小米 YU7 用车费', amount: 1056 },
          { label: '高速过路费（北京→乌丹镇）', amount: 222 },
          { label: '车辆充电（乌丹镇）', amount: 200 },
          { label: '高速过路费（乌丹镇→乌兰布统）', amount: 30 },
          { label: '车辆充电（军马场镇）', amount: 100 },
          { label: '国家一号风景大道通行 / 停车费', amount: 16 },
        ],
      },
      {
        name: '住宿',
        items: [
          { label: '乌丹镇酒店（第一晚）', amount: 150 },
          { label: '乌兰布统草原酒店（第二晚）', amount: 150 },
        ],
      },
      {
        name: '餐饮',
        items: [
          { label: '手把肉午餐（乌丹镇）', amount: 150 },
          { label: '牧民家晚餐（乌兰布统）', amount: 200 },
          { label: '草原早餐（乌兰布统营地）', amount: 30 },
          { label: '冰煮羊午餐（军马场镇）', amount: 200 },
        ],
      },
      {
        name: '门票及其他',
        items: [
          { label: '草原篝火体验', amount: 50 },
          { label: '乌兰布统景区门票', amount: 260 },
        ],
      },
    ],
  },
  destinations: [
    {
      name: '乌白穿沙公路',
      image: 'images/dest-desert-road.jpg',
      summary: '91 公里治沙公路，沙丘与沙生灌丛交错的穿沙奇观。',
      detail: '全程 91 公里沥青公路横贯科尔沁沙地腹地，顺着风沙走势呈波浪起伏状。保持 40-60km/h 车速慢行，沿途选安全停车区拍照，深度体验约 3 小时。',
    },
    {
      name: '灯笼河草原',
      image: 'images/dest-lantern-grassland.jpg',
      summary: '风车群与草海相映的高山草甸。',
      detail: '连绵缓坡上矗立成片白色风力发电机，绿色草海与白色风车相映，夏季遍地野花盛放。可下车漫步草甸，打卡风车群与金界壕古长城遗址。',
    },
    {
      name: '将军泡子',
      image: 'images/dest-sunset-lake.jpg',
      summary: '乌兰布统日落天花板。',
      detail: '开阔湖面完美倒映天空晚霞，远处丘陵与散养马群构成绝美的草原落日画卷。建议从日落前 1 小时抵达，守候完整落日过程。',
    },
    {
      name: '百草敖包',
      image: 'images/dest-aobao.jpg',
      summary: '草原文化的信仰符号。',
      detail: '石砌敖包上挂满经幡与哈达，四周是一望无际的开阔草原。可按草原传统绕敖包三圈祈福，上午光线柔和，拍照出片率极高。',
    },
    {
      name: '乌兰布统影视基地',
      image: 'images/dest-film-studio.jpg',
      summary: '数十部影视剧取景地。',
      detail: '沿木栈道登上山顶观景台，可俯瞰整片连绵起伏的丘陵草原，缓坡、白桦林、散落的羊群构成经典的坝上画卷，视野开阔震撼。',
    },
    {
      name: '国家一号风景大道',
      image: 'images/dest-scenic-byway.jpg',
      summary: '坝上最顶级的自驾景观线路。',
      detail: '全程约 180 公里景观公路，串联草原、森林、湿地、山地多重地貌，全程免费，沿途设有多处观景台，可随时停车远眺拍照。',
    },
  ],
};
