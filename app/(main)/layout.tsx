import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = async ({
    children
} : {
    children: React.ReactNode;
}) => {
    return ( 
        // 类似把 children 作为参数传递给函数 二级路由
        <div className="h-full">
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
               <NavigationSidebar/>
            </div>
            <main className="md:pl-[72px] h-full">
                {children}
            </main>
        </div>
     ); 
}
 
export default MainLayout;