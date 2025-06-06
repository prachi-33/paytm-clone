export function Button({label,onClick}){
    return <button onClick={onClick} type="button" class="px-5 py-2.5 rounded-lg text-sm cursor-pointer tracking-wider font-medium border-2 border-current outline-none bg-orange-700 hover:bg-transparent text-white hover:text-orange-700 transition-all duration-300">
        {label}</button>
}