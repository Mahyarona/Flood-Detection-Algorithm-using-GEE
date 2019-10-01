# Flood-Detection-Algorithm-using-GEE
\documentclass[letterpaper,11pt]{article}
\usepackage[T1]{fontenc}

\usepackage[english]{babel}
\usepackage{amsmath,amsfonts,amsthm}
\usepackage[pdftex]{graphicx}   
\usepackage[top=0.1in,bottom=0.1in,left=0.1in,right=0.1in]{geometry}
\usepackage{sectsty}
\allsectionsfont{\centering \normalfont\scshape}
\usepackage{fancyhdr}
\usepackage{titling}
%\usepackage{authblk}
\usepackage{geometry}
\geometry{margin=0.6in}
\usepackage[utf8]{inputenc}
\usepackage{blindtext}
\usepackage{rotating}
\usepackage{subcaption}
\usepackage{float}
\usepackage{gensymb}
\usepackage{amsmath}
\usepackage{textcomp}
\usepackage{amssymb}
\usepackage[colorlinks=true,citecolor=blue]{hyperref}
\usepackage[super]{nth}
\usepackage{multirow}
\usepackage[utf8]{inputenc}
\usepackage[colorinlistoftodos]{todonotes}
\usepackage[final]{pdfpages}
\usepackage{caption}
\usepackage{setspace}
\doublespacing
\usepackage{xcolor}
\usepackage{titlesec}
\usepackage{booktabs}
 


\titleformat*{\section}{\large\bfseries}
\titleformat*{\subsection}{\large\bfseries}
% Keywords command
\providecommand{\keywords}[1]
{
  \small	
  \textbf{\textit{Keywords---}} #1
}

\title{\textbf{Remote Sensing Technical Test: Flood Detection using Sentinel Imagery and Google Earth Engine Platform}}
\author{\normalfont                 
   \normalsize Mahyar Aboutalebi, Ph.D. Candidate,  \\
     \normalsize Utah Water Research Laboratory,\\
       \normalsize Civil and Environmental Engineering, \\ 
       \normalsize Utah State University, \\
       }

%\affil[]{Ph.D. Student, Utah Water Research Laboratory, \\
%        Civil and Environmental Engineering, \\ 
%        Utah State University.\\
%        Doctorate}
\date{July 2019}

\begin{document}
\maketitle
\clearpage


\newpage
\hypersetup{linkcolor=black}
{\small\tableofcontents}
\hypersetup{linkcolor=black}
{\small\listoffigures}
\hypersetup{linkcolor=black}
{\small\listoftables}
\hypersetup{linkcolor=red}

\title{\small\textbf{Technical Test: Flood Detection using Sentinel Imagery and Google Earth Engine Platform}\vspace{-20ex}}
\author{\small\color{white}x}
%\affil[]{}
\date{\small\color{white}x}

\maketitle

%\begin{abstract}


%\end{abstract}


%\keywords{}


\linespread{0.5}
\onehalfspacing
\section{Proposed Approach to Detect Flooded Regions}
In this technical test, two Sentinel images (Sentinel-1 SAR and Sentinel-2 optical images) are given to detect flooded area and to estimate the affected people. Due to the high cloud cover, algorithms taking advantage of training network using optical bands (e.g. machine learning techniques) are not able to fully extract flooded pixels, particularly in shaded areas and cloudy pixels. In contrast, active sensors emitting signals in the microwave wavelength offer an alternative to see invisible areas such as cloudy pixels (\cite{ANUSHA}). Therefore, for this work, the Synthetic Aperture Radar (SAR) product from Sentinel-1 is used to create a flood inundation map. To detect flooded pixels, an algorithm is proposed and implemented in Google Earth Engine (GEE) platform. In the proposed algorithm, the speckle noise is filtered first, then the permanent water is masked out from the image with two steps (using Hansen dataset (\cite{Hansen}) and a user-defined threshold) and ultimately flooded pixels are separated from non-flooded ones using Otsu threshold method. The Otsu algorithm (\cite{Otsu}) can determine an optimum threshold based on the maximization of the between-class variance of the foreground (flooded) and background (nonflooded) pixels in the image, if the distribution of histograms is Gaussian (\cite{Landuyt}). Without masking out permanent water pixels and also violating the Gaussian assumption, the performance of the proposed algorithm is questionable (\cite{Landuyt}). One way to improve the algorithm is to divide the image into several tiles, calculate a coefficient (such as Ashman coefficient \cite{Ashman}) that shows separability of the histogram for each tile, remove non-separable tiles such as tiles that are completely occupied by one feature (e.g. water, vegetation, etc.) from calculation, and execute the Otsu algorithm for all tiles having bio-modal histogram (e.g. high Ashman coefficient). This technique is called tiled-based Otsu algorithm (\cite{Chini}).      
\onehalfspacing
\section{Proposed Approach to Estimate Affected People}
Due to the availability of High-Resolution Settlement Layer (HRSL) in Geotiff format and in shared GEE asset as well as its resolution ($\sim$ 30 m) which is equal to the flood map resolution after image denoising, HRSL is used to estimate affected people. In the method, to remove non-affected people from the calculation, the flood map (1 for flooded pixels and 0 for non-flooded pixels at 30 m resolution) is multiplied by HRSL. Next, the total number of affected people in each sub-region is calculated by the available functions in GEE. If the permanent water regions are not completely masked, it leads to an overestimation in total number of affected people. Besides, if people already moved to somewhere else due to early flood warning system, the proposed model overestimates the number of affected people as well.         
\onehalfspacing
\section{Scalability/Accuracy of the Proposed Method}
To determine a flood inundation map from SAR images, the general assumption is that there is more scattering (more bright pixels) in flooded regions. However, this assumption can be violated in urban areas where there is doublebounce scattering. Thus, most of threshold-based algorithms can perform better in rural areas although tiled-based approach or masking out non-flooded areas (such as 10 m threshold in height above nearest drainage (HAND) map \cite{SCHLAFFER}) might improve their accuracy, although to assess the performance of these algorithms, the results must be compared with benchmark data or they can be visually inspected with an RGB imagery.




\medskip
\bibliographystyle{abbrv}
\bibliography{myref}




\end{document}
