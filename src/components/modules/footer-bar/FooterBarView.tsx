import type { FooterBarData } from './normalize'

interface FooterBarViewProps {
  data: FooterBarData
}

export function FooterBarView({ data }: FooterBarViewProps) {
  return (
    <footer className="w-full">
      <div className="w-full">
        <div className="grid grid-cols-1">
          <div className="bg-[#c9c9c9] px-6 py-3 text-center text-[#595757]">
            <small className="copyright block text-xs leading-6">
              <span className="block md:inline">{data.copyrightText}</span>
              <span className="block md:inline md:ml-2">
                網站製作：
                <a
                  href="https://www.utmost.com.tw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline underline-offset-2 transition-opacity hover:opacity-75"
                >
                  UTMOST
                </a>
              </span>
            </small>
          </div>
        </div>
      </div>
    </footer>
  )
}
