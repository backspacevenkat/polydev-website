#!/usr/bin/env python3

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="polydev-perspectives",
    version="1.0.0",
    author="Polydev AI",
    author_email="support@polydev.ai",
    description="CLI tool for the Polydev Perspectives multi-LLM API",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/polydev-ai/perspectives-cli",
    py_modules=["perspectives"],
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.7",
    install_requires=[
        "requests>=2.28.0",
        "scikit-learn>=1.3.0",
        "numpy>=1.21.0",
    ],
    entry_points={
        "console_scripts": [
            "polydev-perspectives=perspectives:main",
        ],
    },
)