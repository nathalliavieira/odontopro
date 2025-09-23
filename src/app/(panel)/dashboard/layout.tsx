import { SidebarDashboard } from "./_components/sidebar";

export default function Dahsboard({children,}: {children: React.ReactNode}){
    return(
        <>
            <SidebarDashboard>
                {children}
            </SidebarDashboard>
        </>
    )
}