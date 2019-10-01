# Flood-Detection-Algorithm-using-GEE

| ![A Sample of Flooded Regions along with Affected Population \label{fig:1}](https://github.com/Mahyarona/Flood-Detection-Algorithm-using-GEE/blob/master/Flood_Affected_pop.png) | 
|:--:| 
| *Fig 1. A Sample of Flooded Regions along with Affcetd Population * |

## Proposed Approach to Detect Flooded Regions
In this technical test, two Sentinel images (Sentinel-1 SAR and Sentinel-2 optical images) are given to detect flooded area and to estimate the affected people. Due to the high cloud cover, algorithms taking advantage of training network using optical bands (e.g. machine learning techniques) are not able to fully extract flooded pixels, particularly in shaded areas and cloudy pixels. In contrast, active sensors emitting signals in the microwave wavelength offer an alternative to see invisible areas such as cloudy pixels (\cite{ANUSHA}). Therefore, for this work, the Synthetic Aperture Radar (SAR) product from Sentinel-1 is used to create a flood inundation map. To detect flooded pixels, an algorithm is proposed and implemented in Google Earth Engine (GEE) platform. In the proposed algorithm, the speckle noise is filtered first, then the permanent water is masked out from the image with two steps (using Hansen dataset (\cite{Hansen}) and a user-defined threshold) and ultimately flooded pixels are separated from non-flooded ones using Otsu threshold method. The Otsu algorithm (\cite{Otsu}) can determine an optimum threshold based on the maximization of the between-class variance of the foreground (flooded) and background (nonflooded) pixels in the image, if the distribution of histograms is Gaussian (\cite{Landuyt}). Without masking out permanent water pixels and also violating the Gaussian assumption, the performance of the proposed algorithm is questionable (\cite{Landuyt}). One way to improve the algorithm is to divide the image into several tiles, calculate a coefficient (such as Ashman coefficient \cite{Ashman}) that shows separability of the histogram for each tile, remove non-separable tiles such as tiles that are completely occupied by one feature (e.g. water, vegetation, etc.) from calculation, and execute the Otsu algorithm for all tiles having bio-modal histogram (e.g. high Ashman coefficient). This technique is called tiled-based Otsu algorithm (\cite{Chini}).      


## Proposed Approach to Estimate Affected People
Due to the availability of High-Resolution Settlement Layer (HRSL) in Geotiff format and in shared GEE asset as well as its resolution ($\sim$ 30 m) which is equal to the flood map resolution after image denoising, HRSL is used to estimate affected people. In the method, to remove non-affected people from the calculation, the flood map (1 for flooded pixels and 0 for non-flooded pixels at 30 m resolution) is multiplied by HRSL. Next, the total number of affected people in each sub-region is calculated by the available functions in GEE. If the permanent water regions are not completely masked, it leads to an overestimation in total number of affected people. Besides, if people already moved to somewhere else due to early flood warning system, the proposed model overestimates the number of affected people as well.         


## Scalability/Accuracy of the Proposed Method
To determine a flood inundation map from SAR images, the general assumption is that there is more scattering (more bright pixels) in flooded regions. However, this assumption can be violated in urban areas where there is doublebounce scattering. Thus, most of threshold-based algorithms can perform better in rural areas although tiled-based approach or masking out non-flooded areas (such as 10 m threshold in height above nearest drainage (HAND) map \cite{SCHLAFFER}) might improve their accuracy, although to assess the performance of these algorithms, the results must be compared with benchmark data or they can be visually inspected with an RGB imagery.


## BibTex
@ARTICLE{Landuyt, 
author={L. {Landuyt} and A. {Van Wesemael} and G. J. -. {Schumann} and R. {Hostache} and N. E. C. {Verhoest} and F. M. B. {Van Coillie}}, 
journal={IEEE Transactions on Geoscience and Remote Sensing}, 
title={Flood Mapping Based on Synthetic Aperture Radar: An Assessment of Established Approaches}, 
year={2019}, 
volume={57}, 
number={2}, 
pages={722-739}, 
doi={10.1109/TGRS.2018.2860054}, 
ISSN={0196-2892}, 
month={Feb},}


@article {Hansen,
author = {Hansen, M. C. and Potapov, P. V. and Moore, R. and Hancher, M. and Turubanova, S. A. and Tyukavina, A. and Thau, D. and Stehman, S. V. and Goetz, S. J. and Loveland, T. R. and Kommareddy, A. and Egorov, A. and Chini, L. and Justice, C. O. and Townshend, J. R. G.},
title = {High-Resolution Global Maps of 21st-Century Forest Cover Change},
volume = {342},
number = {6160},
pages = {850--853},
year = {2013},
doi = {10.1126/science.1244693},
publisher = {American Association for the Advancement of Science},
issn = {0036-8075},
URL = {https://science.sciencemag.org/content/342/6160/850},
eprint = {https://science.sciencemag.org/content/342/6160/850.full.pdf},
journal = {Science}
}

@article{ANUSHA,
title = "Flood detection and flood mapping using multi-temporal synthetic aperture radar and optical data",
journal = "The Egyptian Journal of Remote Sensing and Space Science",
year = "2019",
issn = "1110-9823",
doi = "https://doi.org/10.1016/j.ejrs.2019.01.001",
url = "http://www.sciencedirect.com/science/article/pii/S1110982318303041",
author = "N. Anusha and B. Bharathi",

@ARTICLE{Otsu, 
author={N. {Otsu}}, 
journal={IEEE Transactions on Systems, Man, and Cybernetics}, 
title={A Threshold Selection Method from Gray-Level Histograms}, 
year={1979}, 
volume={9}, 
number={1}, 
pages={62-66}, 
keywords={Histograms;Marine vehicles;Radar tracking;Least squares approximation;Surveillance;Target tracking;Gaussian distribution;Displays;Q measurement;Sea measurements}, 
doi={10.1109/TSMC.1979.4310076}, 
ISSN={0018-9472}, 
month={Jan},}

@ARTICLE{Ashman,
author = {{Ashman}, K.~M. and {Bird}, C.~M. and {Zepf}, S.~E.},
title = "{Detecting bimodality in astronomical datasets}",
journal = {\aj},
eprint = {astro-ph/9408030},
year = 1994,
month = dec,
volume = 108,
pages = {2348-2361},
doi = {10.1086/117248},
adsurl = {https://ui.adsabs.harvard.edu/abs/1994AJ....108.2348A},
adsnote = {Provided by the SAO/NASA Astrophysics Data System}
}

@ARTICLE{Chini, 
author={M. {Chini} and R. {Hostache} and L. {Giustarini} and P. {Matgen}}, 
journal={IEEE Transactions on Geoscience and Remote Sensing}, 
title={A Hierarchical Split-Based Approach for Parametric Thresholding of SAR Images: Flood Inundation as a Test Case}, 
year={2017}, 
volume={55}, 
number={12}, 
pages={6975-6988}, 
doi={10.1109/TGRS.2017.2737664}, 
ISSN={0196-2892}, 
month={Dec},}

@article{SCHLAFFER,
title = "Flood detection from multi-temporal SAR data using harmonic analysis and change detection",
journal = "International Journal of Applied Earth Observation and Geoinformation",
volume = "38",
pages = "15 - 24",
year = "2015",
issn = "0303-2434",
doi = "https://doi.org/10.1016/j.jag.2014.12.001",
url = "http://www.sciencedirect.com/science/article/pii/S0303243414002645",
author = "Stefan Schlaffer and Patrick Matgen and Markus Hollaus and Wolfgang Wagner",
keywords = "ENVISAT, Sentinel-1, Time series analysis, Otsu, Flood hazard, HAND index",

}
