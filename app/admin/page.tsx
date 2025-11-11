"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { 
  Users, 
  Store, 
  Tag, 
  BarChart3, 
  Shield,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { 
  getAllUsers, 
  getAllRestaurants, 
  getTags,
  getAllPayments,
  getRestaurantDetail,
  AdminUser,
  Restaurant as RestaurantType,
  Tag as TagType,
  Payment,
  DishDetail
} from "@/lib/api"
import { toast } from "@/lib/toast"

type TabType = "dashboard" | "users" | "restaurants" | "tags" | "payments"

export default function AdminPage() {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth()
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalTags: 0,
    totalPayments: 0,
  })
  
  // Data states
  const [users, setUsers] = useState<AdminUser[]>([])
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([])
  const [tags, setTags] = useState<TagType[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  
  // Selected restaurant and dishes
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantType | null>(null)
  const [restaurantDishes, setRestaurantDishes] = useState<DishDetail[]>([])
  const [loadingRestaurantDishes, setLoadingRestaurantDishes] = useState(false)
  
  // Loading states
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingRestaurants, setLoadingRestaurants] = useState(false)
  const [loadingTags, setLoadingTags] = useState(false)
  const [loadingPayments, setLoadingPayments] = useState(false)
  
  // Search states
  const [searchUsers, setSearchUsers] = useState("")
  const [searchRestaurants, setSearchRestaurants] = useState("")
  const [searchTags, setSearchTags] = useState("")
  const [searchPayments, setSearchPayments] = useState("")
  
  // Pagination states for users
  const [usersPage, setUsersPage] = useState(1)
  const [usersPageSize] = useState(10)
  const [usersPageCount, setUsersPageCount] = useState(0)

  // Check if user is admin
  useEffect(() => {
    if (authLoading) return
    
    if (!isAuthenticated || !user) {
      router.push("/login")
      return
    }
    
    // Check if user is admin (assuming roleName "Admin" or roleId === 1)
    const isAdmin = user.roleName === "Admin" || user.roleId === 1
    if (!isAdmin) {
      toast.error(language === "vi" ? "Bạn không có quyền truy cập trang này" : "You don't have permission to access this page")
      router.push("/")
      return
    }
    
    setIsLoading(false)
  }, [user, isAuthenticated, authLoading, router, language])

  // Fetch dashboard stats
  useEffect(() => {
    if (!token || !isAuthenticated || isLoading) return
    
    const fetchStats = async () => {
      try {
        // Fetch all users with large pageSize to get accurate count
        // This ensures we get the actual total count, not calculated from pageCount
        const [usersData, restaurantsData, tagsData, paymentsData] = await Promise.all([
          getAllUsers(token, { pageNumber: 1, pageSize: 1000 }).catch(() => ({ pageSize: 0, pageNumber: 0, pageCount: 0, data: [] })),
          getAllRestaurants(token).catch(() => ({ totalIteams: 0, result: [] })),
          getTags(token).catch(() => []),
          getAllPayments(token).catch((error) => {
            // Check if token expired
            if (error instanceof Error && error.message.includes("expired")) {
              console.error("Token expired when fetching payments")
              toast.error(language === "vi" ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." : "Session expired. Please login again.")
              // Don't throw, just return empty to prevent crash
              return { totalItems: 0, payments: [] }
            }
            return { totalItems: 0, payments: [] }
          }),
        ])
        
        // Calculate total users: fetch all pages if needed to get accurate count
        let totalUsers = 0
        if (usersData.data && usersData.data.length > 0) {
          // If pageCount is 1, we have all users in one page
          if (usersData.pageCount <= 1) {
            totalUsers = usersData.data.length
          } else {
            // If there are multiple pages, fetch all pages to count accurately
            try {
              let allUsers: AdminUser[] = [...usersData.data]
              // Fetch remaining pages
              for (let page = 2; page <= usersData.pageCount; page++) {
                const pageData = await getAllUsers(token, { pageNumber: page, pageSize: 1000 })
                if (pageData.data && pageData.data.length > 0) {
                  allUsers = [...allUsers, ...pageData.data]
                }
                // If we got less than pageSize, we're done (safety check)
                if (pageData.data && pageData.data.length < 1000) {
                  break
                }
              }
              totalUsers = allUsers.length
            } catch (error) {
              // Fallback: if fetching fails, use the first page data length
              // This is not ideal but better than showing 0
              console.warn("Failed to fetch all pages, using first page count:", error)
              totalUsers = usersData.data.length
            }
          }
        } else {
          totalUsers = 0
        }
        
        // Debug: log data to see what we're getting
        console.log("Restaurants data:", restaurantsData)
        console.log("TotalIteams:", restaurantsData.totalIteams)
        console.log("Result length:", restaurantsData.result?.length)
        console.log("Payments data:", paymentsData)
        console.log("Payments totalItems:", paymentsData.totalItems)
        console.log("Payments array length:", paymentsData.payments?.length)
        
        setStats({
          totalUsers: totalUsers,
          totalRestaurants: restaurantsData.totalIteams || restaurantsData.result?.length || 0,
          totalTags: Array.isArray(tagsData) ? tagsData.length : 0,
          totalPayments: paymentsData.totalItems || paymentsData.payments?.length || 0,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }
    
    fetchStats()
  }, [token, isAuthenticated, isLoading])

  // Reset users page when switching tabs
  useEffect(() => {
    if (activeTab !== "users") {
      setUsersPage(1)
    }
  }, [activeTab])

  // Fetch data based on active tab
  useEffect(() => {
    if (!token || !isAuthenticated || isLoading) return
    
    const fetchData = async () => {
      switch (activeTab) {
        case "users":
          setLoadingUsers(true)
          try {
            const data = await getAllUsers(token, { pageNumber: usersPage, pageSize: usersPageSize })
            setUsers(data.data || [])
            setUsersPageCount(data.pageCount || 0)
          } catch (error) {
            console.error("Failed to fetch users:", error)
            toast.error(language === "vi" ? "Không thể tải danh sách người dùng" : "Failed to load users")
            setUsers([])
            setUsersPageCount(0)
          } finally {
            setLoadingUsers(false)
          }
          break
        case "restaurants":
          setLoadingRestaurants(true)
          try {
            const data = await getAllRestaurants(token)
            setRestaurants(data.result || [])
          } catch (error) {
            console.error("Failed to fetch restaurants:", error)
            toast.error(language === "vi" ? "Không thể tải danh sách nhà hàng" : "Failed to load restaurants")
          } finally {
            setLoadingRestaurants(false)
          }
          break
        case "tags":
          setLoadingTags(true)
          try {
            const data = await getTags(token)
            setTags(Array.isArray(data) ? data : [])
          } catch (error) {
            console.error("Failed to fetch tags:", error)
            toast.error(language === "vi" ? "Không thể tải danh sách tag" : "Failed to load tags")
          } finally {
            setLoadingTags(false)
          }
          break
        case "payments":
          setLoadingPayments(true)
          try {
            // Fetch all users to create userId -> userName map
            // This ensures we have usernames for all payments
            const allUsersData = await getAllUsers(token, { pageNumber: 1, pageSize: 1000 })
            let allUsersList = allUsersData.data || []
            
            // If there are multiple pages, fetch all of them
            if (allUsersData.pageCount > 1) {
              const additionalPages = []
              for (let page = 2; page <= allUsersData.pageCount; page++) {
                try {
                  const pageData = await getAllUsers(token, { pageNumber: page, pageSize: 1000 })
                  if (pageData.data) {
                    additionalPages.push(...pageData.data)
                  }
                } catch (err) {
                  console.warn(`Failed to fetch users page ${page}:`, err)
                }
              }
              allUsersList = [...allUsersList, ...additionalPages]
            }
            
            // Update users state with all users for the map
            setUsers(allUsersList)
            
            // Fetch payments
            const data = await getAllPayments(token)
            setPayments(data.payments || [])
          } catch (error) {
            console.error("Failed to fetch payments:", error)
            toast.error(language === "vi" ? "Không thể tải danh sách thanh toán" : "Failed to load payments")
          } finally {
            setLoadingPayments(false)
          }
          break
      }
    }
    
    fetchData()
  }, [activeTab, token, isAuthenticated, isLoading, language, usersPage, usersPageSize])

  // Handle restaurant click to show dishes
  const handleRestaurantClick = async (restaurantId: number) => {
    if (!token) return
    
    setLoadingRestaurantDishes(true)
    try {
      const restaurant = await getRestaurantDetail(restaurantId, token)
      setSelectedRestaurant(restaurant)
      setRestaurantDishes(restaurant.dishes || [])
    } catch (error) {
      console.error("Failed to fetch restaurant dishes:", error)
      toast.error(language === "vi" ? "Không thể tải danh sách món ăn" : "Failed to load dishes")
    } finally {
      setLoadingRestaurantDishes(false)
    }
  }

  // Filter data based on search
  const filteredUsers = users.filter(u => 
    u.userName.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUsers.toLowerCase())
  )
  
  const filteredRestaurants = restaurants.filter(r =>
    r.resName.toLowerCase().includes(searchRestaurants.toLowerCase()) ||
    r.resAddress.toLowerCase().includes(searchRestaurants.toLowerCase())
  )
  
  const filteredTags = tags.filter(t =>
    t.tagName.toLowerCase().includes(searchTags.toLowerCase())
  )
  
  // Create userId -> userName map
  const userIdToUserNameMap = useMemo(() => {
    const map = new Map<number, string>()
    users.forEach(user => {
      map.set(user.id, user.userName)
    })
    return map
  }, [users])
  
  const filteredPayments = payments.filter(p => {
    const searchTerm = searchPayments.toLowerCase()
    const userName = userIdToUserNameMap.get(p.userId) || ""
    return (
      p.orderCode.toString().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.status.toLowerCase().includes(searchTerm) ||
      userName.toLowerCase().includes(searchTerm)
    )
  })

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {language === "vi" ? "Đang tải..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
      <Header />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-80px)] sticky top-20">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-orange-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {language === "vi" ? "Quản trị viên" : "Admin Panel"}
              </h2>
            </div>
            
            <nav className="space-y-2">
              {[
                { id: "dashboard", label: language === "vi" ? "Tổng quan" : "Dashboard", icon: BarChart3 },
                { id: "users", label: language === "vi" ? "Người dùng" : "Users", icon: Users },
                { id: "restaurants", label: language === "vi" ? "Nhà hàng" : "Restaurants", icon: Store },
                { id: "tags", label: language === "vi" ? "Thẻ" : "Tags", icon: Tag },
                { id: "payments", label: language === "vi" ? "Thanh toán" : "Payments", icon: CreditCard },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabType)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                      activeTab === item.id
                        ? "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                {language === "vi" ? "Tổng quan" : "Dashboard"}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div 
                  onClick={() => setActiveTab("users")}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow hover:scale-105 transform transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {language === "vi" ? "Người dùng" : "Users"}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                    </div>
                    <Users className="text-orange-500" size={32} />
                  </div>
                </div>
                
                <div 
                  onClick={() => setActiveTab("restaurants")}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow hover:scale-105 transform transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {language === "vi" ? "Nhà hàng" : "Restaurants"}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRestaurants}</p>
                    </div>
                    <Store className="text-orange-500" size={32} />
                  </div>
                </div>
                
                <div 
                  onClick={() => setActiveTab("tags")}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow hover:scale-105 transform transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {language === "vi" ? "Thẻ" : "Tags"}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTags}</p>
                    </div>
                    <Tag className="text-orange-500" size={32} />
                  </div>
                </div>
                
                <div 
                  onClick={() => setActiveTab("payments")}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow hover:scale-105 transform transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {language === "vi" ? "Thanh toán" : "Payments"}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPayments}</p>
                    </div>
                    <CreditCard className="text-orange-500" size={32} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {language === "vi" ? "Quản lý người dùng" : "Manage Users"}
                </h1>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={language === "vi" ? "Tìm kiếm người dùng..." : "Search users..."}
                    value={searchUsers}
                    onChange={(e) => setSearchUsers(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              {loadingUsers ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-slate-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {language === "vi" ? "Tên" : "Name"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {language === "vi" ? "Vai trò" : "Role"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {user.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {user.userName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {user.roleName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Pagination */}
                  {usersPageCount > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {language === "vi" 
                          ? `Trang ${usersPage} / ${usersPageCount}` 
                          : `Page ${usersPage} / ${usersPageCount}`}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setUsersPage(prev => Math.max(1, prev - 1))}
                          disabled={usersPage === 1}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center gap-1"
                        >
                          <ChevronLeft size={16} />
                          {language === "vi" ? "Trước" : "Previous"}
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, usersPageCount) }, (_, i) => {
                            let pageNum: number
                            if (usersPageCount <= 5) {
                              pageNum = i + 1
                            } else if (usersPage <= 3) {
                              pageNum = i + 1
                            } else if (usersPage >= usersPageCount - 2) {
                              pageNum = usersPageCount - 4 + i
                            } else {
                              pageNum = usersPage - 2 + i
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setUsersPage(pageNum)}
                                className={`px-3 py-2 border rounded-lg transition-smooth ${
                                  usersPage === pageNum
                                    ? "bg-orange-500 text-white border-orange-500"
                                    : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                                }`}
                              >
                                {pageNum}
                              </button>
                            )
                          })}
                        </div>
                        <button
                          onClick={() => setUsersPage(prev => Math.min(usersPageCount, prev + 1))}
                          disabled={usersPage === usersPageCount}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center gap-1"
                        >
                          {language === "vi" ? "Sau" : "Next"}
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Restaurants Tab */}
          {activeTab === "restaurants" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {language === "vi" ? "Quản lý nhà hàng" : "Manage Restaurants"}
                </h1>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={language === "vi" ? "Tìm kiếm nhà hàng..." : "Search restaurants..."}
                    value={searchRestaurants}
                    onChange={(e) => setSearchRestaurants(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              {loadingRestaurants ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <div 
                      key={restaurant.id} 
                      onClick={() => handleRestaurantClick(restaurant.id)}
                      className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <img
                        src={restaurant.restaurantImg || "/placeholder.jpg"}
                        alt={restaurant.resName}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {restaurant.resName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {restaurant.resAddress}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ⭐ {restaurant.starRating}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Dishes Modal */}
              {selectedRestaurant && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedRestaurant.resName} - {language === "vi" ? "Danh sách món ăn" : "Dishes"}
                      </h2>
                      <button
                        onClick={() => {
                          setSelectedRestaurant(null)
                          setRestaurantDishes([])
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    
                    <div className="p-6">
                      {loadingRestaurantDishes ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                        </div>
                      ) : restaurantDishes.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                          {language === "vi" ? "Không có món ăn nào" : "No dishes available"}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {restaurantDishes.map((dish) => (
                            <div key={dish.id} className="bg-gray-50 dark:bg-slate-700 rounded-lg overflow-hidden">
                              <img
                                src={dish.dishImage || "/placeholder.jpg"}
                                alt={dish.dishName}
                                className="w-full h-32 object-cover"
                              />
                              <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                  {dish.dishName}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {dish.dishDescription}
                                </p>
                                <p className="text-sm font-semibold text-orange-500">
                                  {dish.dishPrice.toLocaleString("vi-VN")} ₫
                                </p>
                                {dish.isVegan && (
                                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                                    🌱 {language === "vi" ? "Chay" : "Vegan"}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tags Tab */}
          {activeTab === "tags" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {language === "vi" ? "Quản lý thẻ" : "Manage Tags"}
                </h1>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={language === "vi" ? "Tìm kiếm thẻ..." : "Search tags..."}
                    value={searchTags}
                    onChange={(e) => setSearchTags(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              {loadingTags ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {filteredTags.map((tag) => (
                    <div key={tag.tagID} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                      <img
                        src={tag.tagImg || "/placeholder.svg"}
                        alt={tag.tagName}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white text-center">
                          {tag.tagName}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {language === "vi" ? "Quản lý thanh toán" : "Manage Payments"}
                </h1>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={language === "vi" ? "Tìm kiếm thanh toán..." : "Search payments..."}
                    value={searchPayments}
                    onChange={(e) => setSearchPayments(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              {loadingPayments ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-slate-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {language === "vi" ? "Mã đơn" : "Order Code"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {language === "vi" ? "Tên người dùng" : "Username"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {language === "vi" ? "Số tiền" : "Amount"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {language === "vi" ? "Mô tả" : "Description"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {language === "vi" ? "Trạng thái" : "Status"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {language === "vi" ? "Loại" : "Type"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {language === "vi" ? "Ngày tạo" : "Created At"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {language === "vi" ? "Ngày thanh toán" : "Paid At"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredPayments.map((payment) => (
                        <tr key={payment.paymentId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {payment.paymentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {payment.orderCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {userIdToUserNameMap.get(payment.userId) || payment.userId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {payment.amount.toLocaleString("vi-VN")} ₫
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                            {payment.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.status === "PAID" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : payment.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : payment.status === "CANCELLED"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {payment.paymentType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(payment.createdAt).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString("vi-VN") : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  )
}

