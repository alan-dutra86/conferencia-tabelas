
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
    import { FileText, Download, BarChart2, PieChart as PieChartIcon, TrendingUp, TrendingDown } from 'lucide-react';

    const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', '#22c55e', '#f97316'];

    const ComparisonResults = ({ comparisonResult, onExport }) => {
      const chartData = comparisonResult?.summary ? [
        { name: 'Aumentos', value: comparisonResult.summary.countIncreases },
        { name: 'Reduções', value: comparisonResult.summary.countReductions },
      ].filter(item => item.value > 0) : [];

      const topVariationsData = comparisonResult?.changes ? 
        [...comparisonResult.changes]
          .sort((a, b) => Math.abs(b.percentageDifference) - Math.abs(a.percentageDifference))
          .slice(0, 5)
          .map(item => ({
            name: item.description.length > 20 ? item.description.substring(0, 17) + '...' : item.description,
            variation: parseFloat(item.percentageDifference.toFixed(2))
          }))
        : [];
        
      if (!comparisonResult) return null;

      return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <Card className="shadow-lg border-border">
            <CardHeader className="p-6 border-b border-border">
              <CardTitle className="text-2xl font-semibold text-foreground flex items-center"><FileText className="mr-3 h-7 w-7 text-primary" /> Resultados da Comparação</CardTitle>
              <CardDescription className="text-muted-foreground text-base mt-1">
                {comparisonResult.changes.length > 0 
                  ? `Encontrados ${comparisonResult.changes.length} produtos com alteração de preço.`
                  : "Nenhuma alteração de preço encontrada."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="table" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 bg-muted/30 mx-2 mt-2 mb-0.5 border border-input rounded-md">
                  <TabsTrigger value="table" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md text-muted-foreground py-2.5"><FileText className="mr-1.5 h-5 w-5" />Tabela de Alterações</TabsTrigger>
                  <TabsTrigger value="charts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md text-muted-foreground py-2.5"><BarChart2 className="mr-1.5 h-5 w-5" />Gráficos</TabsTrigger>
                </TabsList>
                <TabsContent value="table" className="p-6">
                  {comparisonResult.changes.length > 0 ? (
                    <div className="overflow-x-auto max-h-[500px] rounded-md border border-input">
                      <Table>
                        <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm">
                          <TableRow className="border-b-input">
                            <TableHead className="text-foreground font-medium">Cód. Barras</TableHead>
                            <TableHead className="text-foreground font-medium">Descrição</TableHead>
                            <TableHead className="text-foreground font-medium">Marca</TableHead>
                            <TableHead className="text-right text-foreground font-medium">Preço Loja (R$)</TableHead>
                            <TableHead className="text-right text-foreground font-medium">Preço Fornec. (R$)</TableHead>
                            <TableHead className="text-right text-foreground font-medium">Diferença (R$)</TableHead>
                            <TableHead className="text-right text-foreground font-medium">Diferença (%)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {comparisonResult.changes.map((item, index) => (
                            <motion.tr 
                              key={index} 
                              className="border-b border-input hover:bg-muted/30 text-sm"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                            >
                              <TableCell className="text-muted-foreground font-mono text-xs">{item.barcode}</TableCell>
                              <TableCell className="text-foreground">{item.description}</TableCell>
                              <TableCell className="text-muted-foreground">{item.brand}</TableCell>
                              <TableCell className="text-right text-muted-foreground">{item.oldPrice.toFixed(2)}</TableCell>
                              <TableCell className="text-right text-muted-foreground">{item.newPrice.toFixed(2)}</TableCell>
                              <TableCell className={`text-right font-medium ${item.priceDifference > 0 ? 'text-destructive' : 'text-green-600'}`}>
                                {item.priceDifference.toFixed(2)}
                              </TableCell>
                              <TableCell className={`text-right font-medium ${item.percentageDifference > 0 ? 'text-destructive' : 'text-green-600'}`}>
                                {item.percentageDifference.toFixed(2)}%
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-10">Nenhum produto com alteração de preço para exibir.</p>
                  )}
                </TabsContent>
                <TabsContent value="charts" className="p-6">
                  {comparisonResult.changes.length > 0 && comparisonResult.summary ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {chartData.length > 0 && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="p-4 border border-input rounded-md bg-card">
                          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center"><PieChartIcon className="mr-2 h-5 w-5 text-primary"/>Distribuição de Alterações</h3>
                          <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} fill="hsl(var(--primary))" stroke="hsl(var(--border))">
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))', borderRadius: 'var(--radius)' }} itemStyle={{ color: 'hsl(var(--popover-foreground))' }} formatter={(value, name) => [`${value} produtos`, name]}/>
                              <Legend wrapperStyle={{ color: 'hsl(var(--foreground))', fontSize: '14px' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </motion.div>
                      )}
                      {topVariationsData.length > 0 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="p-4 border border-input rounded-md bg-card">
                          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-accent"/>Top 5 Variações Percentuais</h3>
                            <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={topVariationsData} layout="vertical" margin={{ top: 5, right: 15, left: 40, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={90} tick={{fontSize: 10, fill: 'hsl(var(--muted-foreground))'}}/>
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))', borderRadius: 'var(--radius)' }} 
                                itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                                formatter={(value) => [`${value}%`, "Variação"]}
                                labelFormatter={(label) => comparisonResult.changes.find(c => (c.description.length > 20 ? c.description.substring(0, 17) + '...' : c.description) === label)?.description || label}
                              />
                              <Legend wrapperStyle={{ color: 'hsl(var(--foreground))', fontSize: '14px' }} />
                              <Bar dataKey="variation" name="Variação %" radius={[0, 4, 4, 0]}>
                                {topVariationsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.variation > 0 ? 'hsl(var(--destructive))' : '#22c55e'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </motion.div>
                      )}
                      <motion.div className="md:col-span-2 space-y-2.5 p-5 border border-input rounded-md bg-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h3 className="text-xl font-semibold text-foreground mb-2.5">Resumo Geral</h3>
                        <p className="text-sm text-muted-foreground flex items-center"><BarChart2 className="mr-2 h-4 w-4 text-secondary"/>Total de Produtos Alterados: <span className="font-medium text-foreground ml-1">{comparisonResult.summary.totalChanges}</span></p>
                        <p className="text-sm text-muted-foreground flex items-center"><TrendingUp className="mr-2 h-4 w-4 text-destructive"/>Produtos com Aumento: <span className="font-medium text-destructive ml-1">{comparisonResult.summary.countIncreases}</span> (Média: <span className="font-medium text-destructive ml-1">R$ {comparisonResult.summary.averageIncrease.toFixed(2)}</span>)</p>
                        <p className="text-sm text-muted-foreground flex items-center"><TrendingDown className="mr-2 h-4 w-4 text-green-600"/>Produtos com Redução: <span className="font-medium text-green-600 ml-1">{comparisonResult.summary.countReductions}</span> (Média: <span className="font-medium text-green-600 ml-1">R$ {comparisonResult.summary.averageReduction.toFixed(2)}</span>)</p>
                        {comparisonResult.summary.topIncrease && <p className="text-sm text-muted-foreground">Maior Aumento: <span className="font-medium text-destructive ml-1">{comparisonResult.summary.topIncrease.description} ({comparisonResult.summary.topIncrease.percentage.toFixed(2)}%)</span></p>}
                        {comparisonResult.summary.topReduction && <p className="text-sm text-muted-foreground">Maior Redução: <span className="font-medium text-green-600 ml-1">{comparisonResult.summary.topReduction.description} ({comparisonResult.summary.topReduction.percentage.toFixed(2)}%)</span></p>}
                      </motion.div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-10">Nenhum dado para exibir nos gráficos.</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            {comparisonResult.changes.length > 0 && (
              <CardFooter className="p-6 flex justify-end border-t border-border">
                <Button onClick={onExport} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm">
                  <Download className="mr-2 h-4 w-4" /> Exportar Relatório (.xlsx)
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      );
    };

    export default ComparisonResults;
  