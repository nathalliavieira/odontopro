export function Footer(){
    return(
        <footer className="py-6 text-center text-gray-500 text-sm md:text-base">
            <p>All rights reserved © {new Date().getFullYear()} - <span className="hover:text-black duration-300">@dev</span></p>
        </footer>
    )
}