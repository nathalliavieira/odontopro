import Link from "next/link";

export function LabelSubscription({expired}: {expired: boolean}){
    return(
        <div className="bg-red-400 text-white text-sm md:text-base px-3 py-2 my-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-1">
            <div>
                {expired ? (
                    <h3 className="font-semibold">Your plan has expired or you don't have an active plan!</h3>
                ) : (
                    <h3 className="font-semibold">You've exceeded the limit of your plan!</h3>
                )}

                <p className="text-sm text-gray-50">Access your plan to check the details.</p>
            </div>

            <Link
                href="/dashboard/plans"
                className="bg-zinc-900 text-white px-3 py-1 w-fit rounded-md"
            >Access plans</Link>
        </div>
    )
}