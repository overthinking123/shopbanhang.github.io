export type Language = 'vi' | 'en';

export type TranslationKeys =
  | 'play'
  | 'puzzles'
  | 'learn'
  | 'watch'
  | 'news'
  | 'social'
  | 'more'
  | 'search'
  | 'signUp'
  | 'logIn'
  | 'logOut'
  | 'getStarted'
  | 'heroTitle'
  | 'heroSubtitle'
  | 'english'
  | 'vietnamese'
  | 'whitesTurn'
  | 'blacksTurn'
  | 'restart'
  | 'invalidMove'
  | 'lightMode'
  | 'darkMode'
  | 'collapse'
  | 'settings'
  | 'fullName'
  | 'phone'
  | 'country'
  | 'usernameEmail'
  | 'password'
  | 'mateIn1'
  | 'mateIn2'
  | 'mateIn3'
  | 'mateIn4'
  | 'forum'
  | 'findFriends'
  | 'grandmasters'
  | 'articles'
  | 'quizzes'
  | 'lessons'
  | 'boardAndPieces'
  | 'saveSettings'
  | 'cancel'
  | 'resign'
  | 'gameOver'
  | 'newGame'
  | 'draw'
  | 'checkmate';

type TranslationMap = Record<TranslationKeys, string>;

export const translations: Record<Language, TranslationMap> = {
  vi: {
    play: "Chơi",
    puzzles: "Câu đố",
    learn: "Học tập",
    watch: "Theo dõi",
    news: "Tin tức",
    social: "Cộng đồng",
    more: "Hơn nữa",
    search: "Tìm kiếm",
    signUp: "Đăng ký",
    logIn: "Đăng nhập",
    logOut: "Đăng xuất",
    getStarted: "Bắt đầu ngay",
    heroTitle: "Chơi Cờ Vua Online trên Trang web #1!",
    heroSubtitle: "Tham gia cùng 230 triệu+ người chơi trong cộng đồng cờ vua lớn nhất thế giới",
    english: "Tiếng Anh",
    vietnamese: "Tiếng Việt",
    whitesTurn: "Lượt của Trắng",
    blacksTurn: "Lượt của Đen",
    restart: "Chơi lại",
    invalidMove: "Nước đi không hợp lệ!",
    lightMode: "Giao diện sáng",
    darkMode: "Giao diện tối",
    collapse: "Thu gọn",
    settings: "Cài đặt",
    fullName: "Họ và tên",
    phone: "Số điện thoại",
    country: "Quốc gia",
    usernameEmail: "Username hoặc Email",
    password: "Mật khẩu",
    mateIn1: "Chiếu hết trong 1 nước",
    mateIn2: "Chiếu hết trong 2 nước",
    mateIn3: "Chiếu hết trong 3 nước",
    mateIn4: "Chiếu hết trong 4 nước",
    forum: "Diễn đàn",
    findFriends: "Tìm bạn bè",
    grandmasters: "Đại kiện tướng",
    articles: "Bài viết",
    quizzes: "Câu hỏi",
    lessons: "Bài học",
    boardAndPieces: "Bàn cờ & Quân cờ",
    saveSettings: "Lưu cài đặt",
    cancel: "Hủy",
    resign: "Đầu hàng",
    gameOver: "Ván cờ kết thúc",
    newGame: "Ván mới",
    draw: "Hòa cờ",
    checkmate: "Chiếu hết"
  },

  en: {
    play: "Play",
    puzzles: "Puzzles",
    learn: "Learn",
    watch: "Watch",
    news: "News",
    social: "Community",
    more: "More",
    search: "Search",
    signUp: "Sign Up",
    logIn: "Log In",
    logOut: "Log Out",
    getStarted: "Get Started",
    heroTitle: "Play Chess Online on the #1 Site!",
    heroSubtitle: "Join 230+ million players in the world's largest chess community",
    english: "English",
    vietnamese: "Vietnamese",
    whitesTurn: "White's Turn",
    blacksTurn: "Black's Turn",
    restart: "Restart",
    invalidMove: "Invalid move!",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    collapse: "Collapse",
    settings: "Settings",
    fullName: "Full Name",
    phone: "Phone Number",
    country: "Country",
    usernameEmail: "Username or Email",
    password: "Password",
    mateIn1: "Mate in 1",
    mateIn2: "Mate in 2",
    mateIn3: "Mate in 3",
    mateIn4: "Mate in 4",
    forum: "Forum",
    findFriends: "Find Friends",
    grandmasters: "Grandmasters",
    articles: "Articles",
    quizzes: "Quizzes",
    lessons: "Lessons",
    boardAndPieces: "Board & Pieces",
    saveSettings: "Save Settings",
    cancel: "Cancel",
    resign: "Resign",
    gameOver: "Game Over",
    newGame: "New Game",
    draw: "Draw",
    checkmate: "Checkmate"
  }
};
