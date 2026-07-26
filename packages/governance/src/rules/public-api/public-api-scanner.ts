// // packages/governance/src/rules/public-api/public-api-scanner.ts

// import type { Diagnostic, PackageDescriptor } from '@arch/platform-model';

// import type { GovernanceExecutionContext } from '../../context/governance-context.js';
// import { ExportMapReader } from './export-map-reader.js';
// import { PrivatePathDetector } from './private-path-detector.js';

// export class PublicApiScanner {
//   constructor(
//     private readonly privatePathDetector = new PrivatePathDetector(),
//     private readonly exportMapReader = new ExportMapReader(),
//   ) {}

//   async scan(context: GovernanceExecutionContext): Promise<Diagnostic[]> {
//     const diagnostics: Diagnostic[] = [];

//     const graph = context.analysis.symbolGraph;

//     const symbols = new Map(graph.nodes.map((node) => [node.id, node]));

//     for (const edge of graph.edges) {
//       if (edge.type !== 'import') {
//         continue;
//       }

//       const source = symbols.get(edge.from);

//       const target = symbols.get(edge.to);

//       if (!source || !target) {
//         continue;
//       }

//       if (source.package === target.package) {
//         continue;
//       }

//       const targetPackage = this.findPackage(context, target.package);

//       if (targetPackage && edge.importPath) {
//         if (
//           this.privatePathDetector.isPrivate(edge.importPath, targetPackage.boundaries?.private)
//         ) {
//           diagnostics.push({
//             code: 'ARCH_PRIVATE_API_ACCESS',

//             severity: 'error',

//             source: 'governance',

//             message: `Package ${source.package} imports private path ${edge.importPath}`,

//             hint: 'Use the public package API',

//             metadata: {
//               rule: 'OnlyPublicApiRule',

//               importer: source.package,

//               imported: target.package,

//               importPath: edge.importPath,
//             },
//           });

//           continue;
//         }

//         if (
//           !this.exportMapReader.isExported(
//             targetPackage.name,
//             edge.importPath,
//             targetPackage.manifest,
//           )
//         ) {
//           diagnostics.push({
//             code: 'ARCH_EXPORT_BOUNDARY_VIOLATION',

//             severity: 'error',

//             source: 'governance',

//             message: `Import ${edge.importPath} is not part of ${target.package} public exports`,

//             hint: 'Expose the module through package exports',
//           });

//           continue;
//         }
//       }

//       if (!target.exported) {
//         diagnostics.push({
//           code: 'ARCH_ONLY_PUBLIC_API',

//           severity: 'error',

//           source: 'governance',

//           message: `Package ${source.package} imports non-public symbol ${target.name} from ${target.package}`,

//           hint: `Expose ${target.name} through the public package API`,
//         });
//       }
//     }

//     return Promise.resolve(diagnostics);
//   }

//   private findPackage(
//     context: GovernanceExecutionContext,
//     name: string,
//   ): PackageDescriptor | undefined {
//     return context.workspace.packages.find((pkg) => pkg.name === name);
//   }
// }
