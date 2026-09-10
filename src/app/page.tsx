import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-right w-full">
          مقایسه ترجمه‌های کتاب
        </h1>
        <p className="text-lg text-center sm:text-right w-full text-gray-600 dark:text-gray-300">
          بهترین ترجمه را برای مطالعه خود پیدا کنید. نقدها، امتیازها و نظرات کاربران را درباره ترجمه‌های مختلف بخوانید.
        </p>
        
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/books"
          >
            مشاهده کتاب‌ها و ترجمه‌ها
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <span>© ۱۴۰۵ - پلتفرم نقد ترجمه</span>
      </footer>
    </div>
  );
}