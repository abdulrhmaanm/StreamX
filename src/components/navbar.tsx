import { useState } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"  // ← add RouterLink
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar"
import { Input } from "@heroui/input"
import { Kbd } from "@heroui/kbd"
import { siteConfig } from "@/config/site"
import { SearchIcon } from "@/components/icons"

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const searchInput = (
    <form onSubmit={handleSearch} className="w-full">
      <Input
        aria-label="Search"
        value={searchQuery}
        onValueChange={setSearchQuery}
        classNames={{
          base: "w-full",
          inputWrapper: [
            "bg-white/5", "border", "border-white/10",
            "hover:border-blue-500/40", "focus-within:border-blue-500/60",
            "backdrop-blur-sm", "rounded-full", "transition-all", "duration-300", "h-10",
          ],
          input: "text-sm text-white placeholder:text-zinc-500",
        }}
        endContent={
          <Kbd className="hidden lg:inline-flex bg-white/5 border border-white/10 text-zinc-500 text-[10px] px-1.5" keys={["command"]}>
            K
          </Kbd>
        }
        labelPlacement="outside"
        placeholder="Search movies & shows..."
        startContent={<SearchIcon className="text-zinc-500 pointer-events-none flex-shrink-0 text-base" />}
        type="search"
      />
    </form>
  )

  return (
    <HeroUINavbar
      maxWidth="full"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        base: ["bg-[#07070a]/60", "backdrop-blur-xl", "border-b", "border-white/5", "px-4", "sm:px-8"],
        wrapper: "max-w-7xl mx-auto",
      }}
    >
      <NavbarContent className="basis-auto" justify="start">
        <NavbarBrand className="gap-3 mr-6">
          {/* ✅ RouterLink instead of HeroUI Link */}
          <RouterLink to="/" className="flex items-center gap-2 no-underline">
            <span className="text-blue-400 text-2xl leading-none">▶</span>
            <span className="text-xl font-extrabold tracking-tight text-white">
              STREAM<span className="text-blue-400">X</span>
            </span>
          </RouterLink>
        </NavbarBrand>

        <div className="hidden lg:flex items-center gap-1">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              {/* ✅ RouterLink instead of HeroUI Link */}
              <RouterLink
                to={item.href}
                className="text-sm font-medium text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all no-underline"
              >
                {item.label}
              </RouterLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex flex-1 max-w-sm mx-8" justify="center">
        <NavbarItem className="w-full">{searchInput}</NavbarItem>
      </NavbarContent>

      <NavbarContent className="basis-auto" justify="end">
        <NavbarItem className="hidden sm:flex">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white border-2 border-white/20 cursor-pointer hover:border-blue-400 transition-all">
            U
          </div>
        </NavbarItem>
        <NavbarMenuToggle className="lg:hidden text-zinc-400 hover:text-white transition-colors" />
      </NavbarContent>

      <NavbarMenu className="bg-[#07070a]/95 backdrop-blur-xl border-t border-white/5 pt-6 pb-8 px-6 gap-4">
        <div className="mb-2">{searchInput}</div>

        <div className="flex flex-col gap-1">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              {/* ✅ RouterLink instead of HeroUI Link */}
              <RouterLink
                to={item.href ?? "#"}
                className="text-base font-medium text-zinc-400 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-all w-full block no-underline"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </RouterLink>
            </NavbarMenuItem>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white border-2 border-white/20">
            U
          </div>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  )
}