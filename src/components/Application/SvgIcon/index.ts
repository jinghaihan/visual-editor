export function importAllSvg(): void {
  try {
    const requireContext: __WebpackModuleApi.RequireContext = require.context(
      '../../../assets/svg',
      false,
      /\.svg$/,
    )
    requireContext.keys().forEach(requireContext)
  } catch (error) {}
}
