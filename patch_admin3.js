const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const reviewsBlock = `
          {activeTab === "reviews" && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex justify-between items-center gap-3">
                <div>
                  <h1 className="text-xl md:text-3xl font-black tracking-tight uppercase">
                    Reviews ({reviews.length})
                  </h1>
                </div>
              </div>

              <div className="bg-white rounded-[20px] md:rounded-[24px] shadow-sm border border-[#ADACB5]/30 overflow-hidden flex flex-col">
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-[#ECEAEF] border-b border-[#ADACB5]/30">
                        <th className="py-4 px-4 md:px-6 text-[10px] md:text-xs font-black tracking-widest uppercase text-[#2D3142]/70">Rating</th>
                        <th className="py-4 px-4 md:px-6 text-[10px] md:text-xs font-black tracking-widest uppercase text-[#2D3142]/70">Review</th>
                        <th className="py-4 px-4 md:px-6 text-[10px] md:text-xs font-black tracking-widest uppercase text-[#2D3142]/70">Customer</th>
                        <th className="py-4 px-4 md:px-6 text-[10px] md:text-xs font-black tracking-widest uppercase text-[#2D3142]/70">Status</th>
                        <th className="py-4 px-4 md:px-6 text-[10px] md:text-xs font-black tracking-widest uppercase text-[#2D3142]/70 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((rev) => (
                        <tr key={rev.id} className="border-b border-[#ADACB5]/20 hover:bg-[#ECEAEF]/50 transition-colors">
                          <td className="py-4 px-4 md:px-6 align-top">
                            <div className="flex flex-col gap-1">
                              <div className="flex text-[#2D3142]">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} className={\`w-3 h-3 \${s <= rev.rating ? "fill-[#2D3142]" : "text-[#ADACB5]"}\`} />
                                ))}
                              </div>
                              {rev.is_verified_purchase && (
                                <span className="text-[9px] font-black tracking-widest text-[#2D3142]/70 uppercase">Verified</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 md:px-6 align-top">
                            <div className="max-w-xs md:max-w-md">
                              {rev.title && <p className="font-bold text-xs uppercase mb-1 text-[#2D3142]">{rev.title}</p>}
                              <p className="text-xs text-[#2D3142]/80 line-clamp-2">{rev.body}</p>
                              <p className="text-[9px] text-[#2D3142]/50 mt-1">{new Date(rev.created_at).toLocaleDateString()}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 md:px-6 align-top text-xs font-semibold text-[#2D3142]">
                            {rev.profiles?.full_name || "Unknown"}
                          </td>
                          <td className="py-4 px-4 md:px-6 align-top">
                            <span className={\`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-black tracking-widest uppercase \${rev.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}\`}>
                              {rev.is_approved ? "Approved" : "Hidden"}
                            </span>
                          </td>
                          <td className="py-4 px-4 md:px-6 align-top text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={async () => {
                                  try {
                                    const res = await fetch(\`/api/admin/reviews?id=\${rev.id}\`, {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ is_approved: !rev.is_approved })
                                    });
                                    if (res.ok) fetchData();
                                  } catch(e) {}
                                }}
                                className="w-8 h-8 rounded-full bg-[#ECEAEF] flex items-center justify-center text-[#2D3142] hover:bg-[#D8D5DB] transition-colors"
                                title={rev.is_approved ? "Hide Review" : "Approve Review"}
                              >
                                {rev.is_approved ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4 opacity-50" />}
                              </button>
                              <button
                                onClick={async () => {
                                  const confirmed = await confirm({ title: "DELETE REVIEW?", message: "Are you sure you want to delete this review?", confirmText: "DELETE", cancelText: "CANCEL", destructive: true });
                                  if (confirmed) {
                                    try {
                                      const res = await fetch(\`/api/admin/reviews?id=\${rev.id}\`, { method: "DELETE" });
                                      if (res.ok) fetchData();
                                    } catch(e) {}
                                  }
                                }}
                                className="w-8 h-8 rounded-full bg-[#ECEAEF] flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reviews.length === 0 && (
                    <div className="p-8 text-center text-sm font-semibold text-[#2D3142]/60 uppercase tracking-wider">
                      No reviews found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
`;

content = content.replace(
  /\{\s*\/\* Mobile Bottom Nav \*\/\s*\}/,
  reviewsBlock + '\n\n        {/* Mobile Bottom Nav */}'
);

fs.writeFileSync('src/app/admin/page.tsx', content);
