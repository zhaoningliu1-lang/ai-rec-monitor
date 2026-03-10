import Link from "next/link";

export const metadata = {
  title: "Electronics AI Visibility Report - Avanti Research",
  description: "AI visibility analysis for electronics cross-border sellers",
};

export default function ResearchPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{background: "rgba(255,107,53,0.12)", color: "#ff6b35"}}>
            Research Report
          </span>
          <span className="text-xs" style={{color: "#7070a0"}}>2026-03-10 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold">Electronics AI Visibility Report</h1>
      </div>
      
      <div className="prose prose-invert max-w-none space-y-6" style={{color: "#b0b0d0"}}>
        <p>Global e-commerce is projected to reach $6.5 trillion by 2023, with electronics accounting for 22% of the market. AI in e-commerce is expected to grow at 42.8% CAGR, reaching $19.9 billion by 2028.</p>
        
        <h2>Key Trends</h2>
        <ul>
          <li><strong>Personalization</strong>: 75% of consumers prefer personalized experiences</li>
          <li><strong>Predictive Analytics</strong>: 40% increase in usage over 2 years</li>
          <li><strong>AI Chatbots</strong>: 30% reduction in response time</li>
          <li><strong>Visual Search</strong>: 50% increase in consumer usage</li>
        </ul>
        
        <h2>Competitor Analysis</h2>
        <table style={{width: "100%", borderCollapse: "collapse"}}>
          <thead>
            <tr style={{borderBottom: "1px solid #25253f"}}>
              <th style={{textAlign: "left", padding: "8px"}}>Competitor</th>
              <th style={{textAlign: "right", padding: "8px"}}>Market Share</th>
              <th style={{textAlign: "right", padding: "8px"}}>Growth</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{padding: "8px"}}>Amazon</td><td style={{textAlign: "right", padding: "8px"}}>35%</td><td style={{textAlign: "right", padding: "8px"}}>12%</td></tr>
            <tr><td style={{padding: "8px"}}>Alibaba</td><td style={{textAlign: "right", padding: "8px"}}>25%</td><td style={{textAlign: "right", padding: "8px"}}>10%</td></tr>
            <tr><td style={{padding: "8px"}}>eBay</td><td style={{textAlign: "right", padding: "8px"}}>15%</td><td style={{textAlign: "right", padding: "8px"}}>8%</td></tr>
            <tr><td style={{padding: "8px"}}>JD.com</td><td style={{textAlign: "right", padding: "8px"}}>10%</td><td style={{textAlign: "right", padding: "8px"}}>15%</td></tr>
          </tbody>
        </table>
        
        <h2>Recommendations</h2>
        <ol>
          <li>Enhance AI-Powered Personalization</li>
          <li>Leverage Predictive Analytics</li>
          <li>Invest in AI-Driven Customer Service</li>
          <li>Implement Visual Search Technology</li>
          <li>Optimize Supply Chain with AI</li>
        </ol>
        
        <hr style={{borderColor: "#25253f"}}/>
        
        <h2>中文摘要</h2>
        <p>本文分析了3C电子跨境卖家的AI可见度现状。市场数据显示，全球电商市场规模预计2023年达到6.5万亿美元，电子品类占22%。AI在电商领域预计2021-2028年以42.8%的CAGR增长。</p>
        <p>主要趋势：个性化(75%消费者偏好)、预测分析(增长40%)、聊天机器人(响应时间减少30%)、视觉搜索(使用增长50%)。</p>
        <p>竞争对手：Amazon 35%, Alibaba 25%, eBay 15%, JD.com 10%。</p>
      </div>
      
      <div className="pt-8 border-t" style={{borderColor: "#25253f"}}>
        <Link href="/research" style={{color: "#ff6b35"}}>← Back to All Reports</Link>
      </div>
    </div>
  );
}
