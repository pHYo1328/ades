export default function Toggle({ showMenu, setShowMenu }) {
  // const [showMenu, setShowMenu] = useState(false);

  return (
    <button
      data-drawer-target="sidebar-multi-level-sidebar"
      data-drawer-toggle="sidebar-multi-level-sidebar"
      aria-controls="sidebar-multi-level-sidebar"
      type="button"
      className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      onClick={setShowMenu(!showMenu)}
    >
      <span className="sr-only">Open sidebar</span>
      <i class="bi bi-list"></i>
    </button>
  );
}
